const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAllRead,
  markSingleRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMyNotifications);
router.put('/read', markAllRead);
router.put('/:id/read', markSingleRead);

module.exports = router;
