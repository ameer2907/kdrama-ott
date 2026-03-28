const User = require('../models/User');

exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'watchHistory.series',
      select: 'title titleKorean poster backdrop rating year genres'
    });
    const history = user.watchHistory
      .sort((a, b) => b.watchedAt - a.watchedAt)
      .slice(0, 50);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get history' });
  }
};

exports.addToHistory = async (req, res) => {
  try {
    const { seriesId, progress } = req.body;
    const user = await User.findById(req.user._id);

    const existingIdx = user.watchHistory.findIndex(
      h => h.series?.toString() === seriesId
    );

    if (existingIdx >= 0) {
      user.watchHistory[existingIdx].watchedAt = new Date();
      user.watchHistory[existingIdx].progress = progress || 0;
    } else {
      user.watchHistory.unshift({ series: seriesId, progress: progress || 0 });
      if (user.watchHistory.length > 100) {
        user.watchHistory = user.watchHistory.slice(0, 100);
      }
    }

    await user.save();
    res.json({ success: true, message: 'History updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update history' });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { watchHistory: [] } });
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

exports.removeFromHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchHistory: { series: req.params.seriesId } }
    });
    res.json({ success: true, message: 'Removed from history' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from history' });
  }
};
