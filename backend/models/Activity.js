const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  series: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series'
  },
  type: {
    type: String,
    enum: ['view', 'trailer_play', 'favorite_add', 'favorite_remove', 'search', 'download'],
    required: true
  },
  metadata: {
    searchQuery: String,
    duration: Number,
    language: String,
    device: String
  },
  ip: String,
  userAgent: String
}, {
  timestamps: true
});

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ series: 1, type: 1 });
activitySchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
