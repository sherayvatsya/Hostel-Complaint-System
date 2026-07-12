const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllComplaints,
  updateComplaintStatus,
  createUser,
  getAllUsers,
  deleteUser,
  adminDeleteComplaint
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/dashboard', getAdminStats);
router.get('/complaints', getAllComplaints);
router.post('/users', createUser);
router.put('/complaints/:id/status', updateComplaintStatus);
router.delete('/complaints/:id', adminDeleteComplaint);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
