const mongoose = require('mongoose');

const trailerSchema = new mongoose.Schema({
  language: { type: String, enum: ['en', 'ta', 'ml', 'ko'], required: true },
  url: { type: String, required: true },
  youtubeId: { type: String },
  title: { type: String }
});

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  thumbnail: { type: String }
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  year: { type: Number },
  episodes: [episodeSchema]
});

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  titleKorean: { type: String, trim: true },
  titleTranslations: {
    en: String,
    ta: String,
    ml: String,
    ko: String
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  descriptionTranslations: {
    en: String,
    ta: String,
    ml: String,
    ko: String
  },
  genres: [{
    type: String,
    enum: ['Romance', 'Action', 'Thriller', 'Comedy', 'Drama', 'Fantasy', 'Historical', 'Crime', 'Horror', 'Sci-Fi', 'Mystery', 'Medical', 'School', 'Family', 'Political']
  }],
  year: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  totalRatings: { type: Number, default: 0 },
  episodes: { type: Number, default: 16 },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'upcoming'],
    default: 'completed'
  },
  network: { type: String },
  cast: [{
    name: String,
    character: String,
    photo: String
  }],
  director: { type: String },
  writer: { type: String },
  poster: { type: String, required: true },
  backdrop: { type: String },
  trailers: [trailerSchema],
  seasons: [seasonSchema],
  tmdbId: { type: Number },
  imdbId: { type: String },
  tags: [String],
  seriesLanguage: { type: String, default: 'Korean' },
  country: { type: String, default: 'South Korea' },
  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  trailerViews: { type: Number, default: 0 },
  favoriteCount: { type: Number, default: 0 },
  ageRating: { type: String, enum: ['G', 'PG', 'PG-13', 'R', 'NR'], default: 'NR' }
}, {
  timestamps: true
});

seriesSchema.index({ genres: 1, year: -1, rating: -1 });
seriesSchema.index({ isTrending: 1, views: -1 });

module.exports = mongoose.model('Series', seriesSchema);