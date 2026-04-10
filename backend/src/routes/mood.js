const express = require('express')
const MoodLog = require('../models/MoodLog')
const protect = require('../middleware/auth')

const router = express.Router()

// POST /api/mood/log
router.post('/log', protect, async (req, res) => {
  try {
    const { mood, note, tags } = req.body
    if (!mood) return res.status(400).json({ message: 'Mood is required' })
    const log = await MoodLog.create({ userId: req.user._id, mood, note, tags })
    res.status(201).json({ log })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/mood/logs  — last 30 logs
router.get('/logs', protect, async (req, res) => {
  try {
    const logs = await MoodLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30)
    res.json({ logs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/mood/analytics  — weekly summary
router.get('/analytics', protect, async (req, res) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const logs  = await MoodLog.find({ userId: req.user._id, createdAt: { $gte: since } })

    const dayScores = {}
    const emotionCount = {}

    logs.forEach(l => {
      const day = l.createdAt.toLocaleDateString('en-US', { weekday: 'short' })
      dayScores[day]    = (dayScores[day] || []).concat(l.score)
      emotionCount[l.emotion] = (emotionCount[l.emotion] || 0) + 1
    })

    const trend = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => {
      const scores = dayScores[d]
      return scores ? +(scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(1) : null
    })

    const avgScore = logs.length
      ? +(logs.reduce((a,b) => a + b.score, 0) / logs.length).toFixed(1)
      : 0

    const topEmotion = Object.entries(emotionCount).sort((a,b) => b[1]-a[1])[0]?.[0] || 'neutral'

    res.json({ trend, avgScore, totalLogs: logs.length, topEmotion, emotionCount })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
