const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'ai'], required: true },
  text:      { type: String, required: true },
  emotion:   { type: String, default: 'neutral' },
  confidence:{ type: Number, default: 0 },
  risk:      { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  timestamp: { type: Date, default: Date.now },
})

const chatSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, default: 'New conversation' },
  messages:  [messageSchema],
  lastEmotion: { type: String, default: 'neutral' },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true })

chatSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Chat', chatSchema)
