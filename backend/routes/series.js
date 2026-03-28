const express = require('express');
const router = express.Router();
const {
  getSeries, getFeatured, getTrending, getByGenre,
  getSeriesById, getRecommendations, searchSeries,
  createSeries, updateSeries, deleteSeries,
  fetchFromTMDB, trackTrailerView
} = require('../controllers/seriesController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', getSeries);
router.get('/featured', getFeatured);
router.get('/trending', getTrending);
router.get('/by-genre', getByGenre);
router.get('/search', searchSeries);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', optionalAuth, getSeriesById);

// Protected routes
router.post('/:id/trailer-view', optionalAuth, trackTrailerView);

// Admin routes
router.post('/', protect, adminOnly, createSeries);
router.put('/:id', protect, adminOnly, updateSeries);
router.delete('/:id', protect, adminOnly, deleteSeries);
router.post('/tmdb/:tmdbId', protect, adminOnly, fetchFromTMDB);

module.exports = router;
