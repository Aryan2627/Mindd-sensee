const express        = require('express')
const Recommendation = require('../models/Recommendation')
const MoodLog        = require('../models/MoodLog')
const protect        = require('../middleware/auth')

const router = express.Router()

const REC_LIBRARY = {
  anxious: [
    { type: 'breathing',  title: '4-7-8 Breathing',               description: 'Inhale 4s, hold 7s, exhale 8s. Repeat 4 times.',  duration: '3 min' },
    { type: 'meditation', title: 'Body scan meditation',           description: 'Slowly scan from head to toe, releasing tension.', duration: '5 min' },
    { type: 'journaling', title: 'Anxiety dump journal',           description: 'Write every anxious thought without filtering.',   duration: '5 min' },
  ],
  sad: [
    { type: 'journaling', title: 'Gratitude journal',              description: 'Write 3 things you\'re grateful for today.',       duration: '5 min' },
    { type: 'movement',   title: 'Gentle walk outside',            description: 'A slow 10-minute walk in natural light.',          duration: '10 min' },
    { type: 'social',     title: 'Reach out to someone you trust', description: 'Send a message to a friend or family member.',     duration: '5 min' },
  ],
  angry: [
    { type: 'movement',   title: 'Progressive muscle relaxation',  description: 'Tense and release each muscle group.',             duration: '7 min' },
    { type: 'breathing',  title: 'Box breathing',                  description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.',         duration: '3 min' },
    { type: 'journaling', title: 'Anger release writing',          description: 'Write freely about what triggered you.',          duration: '5 min' },
  ],
  happy: [
    { type: 'journaling', title: 'Capture this moment',            description: 'Journal what made today good.',                   duration: '3 min' },
    { type: 'social',     title: 'Spread the joy',                 description: 'Share your positive energy with someone.',        duration: '5 min' },
    { type: 'meditation', title: 'Gratitude meditation',           description: 'Sit quietly and appreciate 3 things.',            duration: '5 min' },
  ],
  neutral: [
    { type: 'breathing',  title: 'Mindful breathing',              description: 'Simply observe your breath for 3 minutes.',       duration: '3 min' },
    { type: 'movement',   title: 'Mindful 10-min walk',            description: 'Walk slowly and notice your surroundings.',       duration: '10 min' },
    { type: 'journaling', title: 'Daily reflection',               description: 'What\'s one thing you\'d like to improve today?', duration: '5 min' },
  ],
}

// GET /api/recommendations  — personalised based on recent mood
router.get('/', protect, async (req, res) => {
  try {
    const lastLog = await MoodLog.findOne({ userId: req.user._id }).sort({ createdAt: -1 })
    const emotion = lastLog?.emotion || 'neutral'
    const recs    = REC_LIBRARY[emotion] || REC_LIBRARY.neutral

    res.json({ recommendations: recs, basedOn: emotion })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/recommendations/:id/complete
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const rec = await Recommendation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { completed: true, completedAt: new Date() },
      { new: true }
    )
    res.json({ rec })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
