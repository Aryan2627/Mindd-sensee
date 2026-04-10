const express = require('express')
const User    = require('../models/User')
const protect = require('../middleware/auth')

const router = express.Router()

// GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
  res.json({ user: req.user })
})

// PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, preferences, emergencyContact } = req.body
    const update = {}
    if (name)             update.name             = name
    if (preferences)      update.preferences      = { ...req.user.preferences, ...preferences }
    if (emergencyContact !== undefined) update.emergencyContact = emergencyContact

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password')
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/user/export — export all user data
router.get('/export', protect, async (req, res) => {
  const MoodLog = require('../models/MoodLog')
  const Chat    = require('../models/Chat')
  const [moods, chats] = await Promise.all([
    MoodLog.find({ userId: req.user._id }),
    Chat.find({ userId: req.user._id }),
  ])
  res.json({ user: req.user, moods, chats })
})

module.exports = router
