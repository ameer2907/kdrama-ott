const User = require('../models/User');
const Series = require('../models/Series');
const Activity = require('../models/Activity');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      select: 'title titleKorean poster backdrop rating year genres status trailers'
    });
    res.json({ success: true, data: user.favorites });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const series = await Series.findById(seriesId);
    if (!series) return res.status(404).json({ error: 'Series not found' });

    const user = await User.findById(req.user._id);
    if (user.favorites.includes(seriesId)) {
      return res.status(400).json({ error: 'Already in favorites' });
    }

    user.favorites.push(seriesId);
    await user.save();
    await Series.findByIdAndUpdate(seriesId, { $inc: { favoriteCount: 1 } });
    await Activity.create({ user: req.user._id, series: seriesId, type: 'favorite_add' });

    res.json({ success: true, message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { seriesId } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: seriesId } });
    await Series.findByIdAndUpdate(seriesId, { $inc: { favoriteCount: -1 } });
    await Activity.create({ user: req.user._id, series: seriesId, type: 'favorite_remove' });

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.includes(req.params.seriesId);
    res.json({ success: true, isFavorite });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check favorite' });
  }
};
