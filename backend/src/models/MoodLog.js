const mongoose = require('mongoose')

const moodLogSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood:    { type: String, required: true },
  score:   { type: Number, min: 1, max: 10, required: true },
  note:    { type: String, default: '', maxlength: 500 },
  emotion: { type: String, default: 'neutral' },
  tags:    [{ type: String }],
}, { timestamps: true })

moodLogSchema.index({ userId: 1, createdAt: -1 })

const moodScoreMap = { '😊 Happy': 8, '😐 Neutral': 5, '😰 Anxious': 4, '😢 Sad': 3, '😠 Angry': 2 }

moodLogSchema.pre('save', function (next) {
  this.score = moodScoreMap[this.mood] || 5
  this.emotion = this.mood.split(' ')[1]?.toLowerCase() || 'neutral'
  next()
})

module.exports = mongoose.model('MoodLog', moodLogSchema)
