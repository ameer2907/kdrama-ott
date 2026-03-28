const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    enum: ['en', 'ta', 'ml', 'ko'],
    default: 'en'
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series'
  }],
  watchHistory: [{
    series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
    watchedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 } // percentage
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set admin role for specific email
userSchema.pre('save', function(next) {
  if (this.email === process.env.ADMIN_EMAIL || this.email === 'ameermalikbahad07@gmail.com') {
    this.role = 'admin';
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
