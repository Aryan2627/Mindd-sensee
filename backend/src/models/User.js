const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, maxlength: 80 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  preferences: {
    darkMode:          { type: Boolean, default: false },
    dailyReminder:     { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    voiceInput:        { type: Boolean, default: false },
    timezone:          { type: String,  default: 'Asia/Kolkata' },
    language:          { type: String,  default: 'en' },
  },
  emergencyContact: { type: String, default: '' },
  sessionsCount:    { type: Number, default: 0 },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

// Indexes
userSchema.index({ email: 1 })

module.exports = mongoose.model('User', userSchema)
