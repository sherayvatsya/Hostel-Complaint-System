const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getForgotPasswordQuestion,
  forgotPassword,
  getUserProfile,
  updateUserProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validateForgotPassword } = require('../middleware/validatorMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/forgot-password/question', getForgotPasswordQuestion);
router.post('/forgot-password', validateForgotPassword, forgotPassword);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/password', protect, changePassword);

module.exports = router;
