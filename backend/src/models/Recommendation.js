const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['breathing', 'journaling', 'movement', 'meditation', 'social'], required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  duration:    { type: String },
  triggeredBy: { type: String },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true })

recommendationSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Recommendation', recommendationSchema)
