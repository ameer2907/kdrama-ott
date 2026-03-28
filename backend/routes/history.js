const express = require('express');
const router = express.Router();
const { getHistory, addToHistory, clearHistory, removeFromHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getHistory);
router.post('/', addToHistory);
router.delete('/', clearHistory);
router.delete('/:seriesId', removeFromHistory);

module.exports = router;
