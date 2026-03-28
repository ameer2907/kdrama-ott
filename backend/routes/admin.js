const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, toggleUserStatus, deleteUser, bulkImportSeries } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/toggle', toggleUserStatus);
router.delete('/users/:userId', deleteUser);
router.post('/series/bulk-import', bulkImportSeries);

module.exports = router;
