const express = require('express')
const axios   = require('axios')
const OpenAI  = require('openai')
const Chat    = require('../models/Chat')
const protect = require('../middleware/auth')

const router = express.Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

const SYSTEM_PROMPT = `You are Mind-Sense, a compassionate AI wellness companion. 
Your role is to provide emotional support, active listening, and gentle guidance.

Rules you MUST follow:
- Never give medical advice or diagnose conditions
- Always maintain a warm, supportive, non-judgmental tone
- Suggest professional help when appropriate
- Keep responses concise (2-4 sentences)
- If risk is HIGH, immediately acknowledge distress and provide crisis resources
- Never encourage harmful behaviours

Crisis resources (India):
- iCall: 9152987821
- Vandrevala Foundation: 1860-2662-345
- AASRA: 9820466627`

// GET /api/chat/conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('title lastEmotion updatedAt')
    res.json({ chats })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/chat/:chatId/messages
router.get('/:chatId/messages', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, userId: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    res.json({ messages: chat.messages })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/chat/send
router.post('/send', protect, async (req, res) => {
  try {
    const { message, chatId, emotion = 'neutral', confidence = 0.5 } = req.body
    if (!message) return res.status(400).json({ message: 'Message is required' })

    // 1. Run risk detection via ML service
    let riskLevel = 'low'
    let mlEmotion = emotion
    try {
      const mlRes = await axios.post(`${ML_URL}/risk-detection`, { text: message }, { timeout: 5000 })
      riskLevel  = mlRes.data.risk
      mlEmotion  = mlRes.data.emotion || emotion
    } catch { /* ML service unavailable — continue */ }

    // 2. Find or create chat session
    let chat
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user._id })
    }
    if (!chat) {
      chat = await Chat.create({ userId: req.user._id, title: message.slice(0, 50) })
    }

    // 3. Build OpenAI context from last 10 messages
    const history = chat.messages.slice(-10).map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }))

    const userContext = `[Detected emotion: ${mlEmotion}, confidence: ${Math.round(confidence * 100)}%, risk: ${riskLevel}]\n${message}`

    // 4. Call OpenAI
    let reply
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: userContext },
        ],
        max_tokens: 200,
        temperature: 0.75,
      })
      reply = completion.choices[0].message.content
    } catch {
      reply = "I'm here with you. It sounds like you're going through something difficult. Would you like to tell me more about how you're feeling?"
    }

    // Append crisis resources if high risk
    if (riskLevel === 'high') {
      reply += "\n\nIf you're in crisis, please reach out immediately: iCall 9152987821 or Vandrevala Foundation 1860-2662-345."
    }

    // 5. Save messages
    chat.messages.push({ role: 'user', text: message, emotion: mlEmotion, confidence, risk: riskLevel })
    chat.messages.push({ role: 'ai',   text: reply,   emotion: mlEmotion, risk: riskLevel })
    chat.lastEmotion = mlEmotion
    await chat.save()

    res.json({ reply, chatId: chat._id, emotion: mlEmotion, risk: riskLevel })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/chat/:chatId
router.delete('/:chatId', protect, async (req, res) => {
  await Chat.findOneAndDelete({ _id: req.params.chatId, userId: req.user._id })
  res.json({ message: 'Chat deleted' })
})

module.exports = router
