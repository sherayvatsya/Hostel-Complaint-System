const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateComplaint } = require('../middleware/validatorMiddleware');

router.use(protect);

router.route('/')
  .post(upload.array('images', 5), validateComplaint, createComplaint)
  .get(getMyComplaints);

router.route('/:id')
  .get(getComplaintById)
  .put(upload.array('images', 5), updateComplaint)
  .delete(deleteComplaint);

module.exports = router;
