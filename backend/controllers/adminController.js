const User = require('../models/User');
const Series = require('../models/Series');
const Activity = require('../models/Activity');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSeries,
      totalViews,
      totalTrailerViews,
      recentUsers,
      topSeries,
      activityStats
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Series.countDocuments(),
      Series.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Series.aggregate([{ $group: { _id: null, total: { $sum: '$trailerViews' } } }]),
      User.find({ role: 'user' }).sort('-createdAt').limit(5).select('name email createdAt lastLogin'),
      Series.find().sort('-views').limit(5).select('title poster views trailerViews favoriteCount'),
      Activity.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ]);

    const dailyActivity = await Activity.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const genreStats = await Series.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalSeries,
          totalViews: totalViews[0]?.total || 0,
          totalTrailerViews: totalTrailerViews[0]?.total || 0
        },
        recentUsers,
        topSeries,
        activityStats,
        dailyActivity,
        genreStats
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments();
    const users = await User.find()
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');
    res.json({ success: true, data: users, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get users' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot modify admin' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'suspended'}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.bulkImportSeries = async (req, res) => {
  try {
    const { series } = req.body;
    if (!Array.isArray(series)) return res.status(400).json({ error: 'series must be an array' });
    const result = await Series.insertMany(series, { ordered: false });
    res.json({ success: true, inserted: result.length });
  } catch (err) {
    res.status(500).json({ error: 'Bulk import failed: ' + err.message });
  }
};
