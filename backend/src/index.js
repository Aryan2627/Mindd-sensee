import insightsRoute from "./routes/insights.js";
import dotenv from 'dotenv'
dotenv.config()
const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
const helmet     = require('helmet')
const compression = require('compression')
const morgan     = require('morgan')
const rateLimit  = require('express-rate-limit')

const authRoutes  = require('./routes/auth')
const userRoutes  = require('./routes/user')
const chatRoutes  = require('./routes/chat')
const moodRoutes  = require('./routes/mood')
const recRoutes   = require('./routes/recommendations')

const app  = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10kb' }))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests, please try again later.' })
app.use('/api/', limiter)

const mongoUri = process.env.MONGO_URI;
const isMockMode = !mongoUri || mongoUri.includes('<user>');

if (isMockMode) {
  console.log('⚠️ Running in MOCK Mode without Database!');
  app.use('/api', (req, res, next) => {
    if (req.url.startsWith('/auth')) {
      const email = req.body && req.body.email ? req.body.email : 'demo@example.com';
      return res.json({ token: 'mock-jwt-token-123', user: { _id: 'user1', name: 'Demo User', email } });
    }
    if (req.url.includes('/chat/conversations')) return res.json({ chats: [] });
    if (req.url.includes('/chat/send')) {
      const axios = require('axios');
      const message = req.body && req.body.message ? req.body.message : '';
      
      return axios.post('http://localhost:8000/risk-detection', { text: message })
        .then(async mlRes => {
           let { emotion, risk } = mlRes.data;
           let reply = '';
           
           if (process.env.GEMINI_API_KEY) {
             try {
               const { GoogleGenerativeAI } = require('@google/generative-ai');
               const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
               const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
               const prompt = `You are Mind-Sense, an empathetic, caring wellness companion AI. A user just said: "${message}". Your internal feeling-detector registered their emotion as: "${emotion}" and risk level as: "${risk}". Reply directly and supportively to the user in 2-3 short, highly empathetic sentences based on what they said and their emotion. Do not mention your internal detector/risk level. Give actionable but gentle comfort.`;
               const result = await model.generateContent(prompt);
               reply = result.response.text();
             } catch (e) {
               console.error("Gemini API Error:", e.message);
               reply = `I'm here for you. I sense you might be feeling ${emotion}. How else can I support you?`;
             }
           } else {
             reply = `I sense you might be feeling ${emotion}. (Please add a free GEMINI_API_KEY to backend/.env to make me truly intelligent!)`;
           }
           
           if (risk === 'high') {
             reply += "\n\nCRISIS RESOURCE: If you are at risk, please reach out to iCall 9152987821 or Vandrevala Foundation 1860-2662-345.";
           }
           return res.json({ reply, chatId: 'chat123', emotion, risk });
        })
        .catch(err => {
           console.error("ML LLM Error:", err.message);
           return res.json({ reply: 'Hi! I could not reach the LLM, but I am still here for you.', chatId: 'chat123', emotion: 'neutral', risk: 'low' });
        });
    }
    if (req.url.includes('/chat/') && req.url.includes('/messages')) return res.json({ messages: [] });
    if (req.url.includes('/mood/logs')) return res.json({ logs: [] });
    if (req.url.includes('/mood/streaks')) return res.json({ streak: 1, lastActive: new Date() });
    if (req.url.includes('/recommendations')) return res.json({ recommendations: [] });
    
    return res.json({ success: true, message: 'Mock response due to no DB' });
  });
}

// Routes
app.use('/api/auth',            authRoutes)
app.use('/api/user',            userRoutes)
app.use('/api/chat',            chatRoutes)
app.use('/api/mood',            moodRoutes)
app.use('/api/recommendations', recRoutes)

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

if (isMockMode) {
  app.listen(PORT, () => console.log(`🚀 Backend (Mock) running on port ${PORT}`))
} else {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ MongoDB connected')
      app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`))
    })
    .catch(err => { console.error('❌ MongoDB connection failed:', err); process.exit(1) })
}
