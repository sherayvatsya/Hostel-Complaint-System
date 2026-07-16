const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_hostelcomplaints_123456', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
        const { name, email, password, roomNumber, hostelBlock, phone, avatar, securityQuestion, securityAnswer } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create a student account only; admin registration is not public.
    const user = await User.create({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
      roomNumber,
      hostelBlock,
      phone,
      avatar: avatar || '',
      role: 'student'
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          roomNumber: user.roomNumber,
          hostelBlock: user.hostelBlock,
          phone: user.phone,
          avatar: user.avatar
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user (must query with +password to compare hashed value)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      res.json({
        success: true,
        token: generateToken(user._id),
        redirectTo,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          roomNumber: user.roomNumber,
          hostelBlock: user.hostelBlock,
          phone: user.phone,
          avatar: user.avatar
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get security question for forgot password
// @route   GET /api/auth/forgot-password/question
// @access  Public
const getForgotPasswordQuestion = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, securityQuestion: user.securityQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving security question' });
  }
};

// @desc    Reset forgotten password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, security answer, and new password' });
    }

    const user = await User.findOne({ email }).select('+securityAnswer +password');
    if (!user || !(await user.matchSecurityAnswer(securityAnswer))) {
      return res.status(401).json({ success: false, message: 'Invalid security answer or email' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error resetting password' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          roomNumber: user.roomNumber,
          hostelBlock: user.hostelBlock,
          phone: user.phone,
          avatar: user.avatar
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

      if (user.role === 'student') {
        user.roomNumber = req.body.roomNumber || user.roomNumber;
        user.hostelBlock = req.body.hostelBlock || user.hostelBlock;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          roomNumber: updatedUser.roomNumber,
          hostelBlock: updatedUser.hostelBlock,
          phone: updatedUser.phone,
          avatar: updatedUser.avatar
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword; // Pre-save hook will hash it
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Incorrect current password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getForgotPasswordQuestion,
  forgotPassword,
  getUserProfile,
  updateUserProfile,
  changePassword
};
