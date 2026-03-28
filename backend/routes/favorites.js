// favorites.js
const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favoritesController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getFavorites);
router.get('/check/:seriesId', checkFavorite);
router.post('/:seriesId', addFavorite);
router.delete('/:seriesId', removeFavorite);

module.exports = router;
