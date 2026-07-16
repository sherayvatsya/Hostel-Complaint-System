const { body, validationResult } = require('express-validator');

// Middleware to check results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// Validate registration
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('securityQuestion').trim().notEmpty().withMessage('Security question is required'),
  body('securityAnswer').trim().notEmpty().withMessage('Security answer is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('roomNumber').trim().custom((value, { req }) => {
    if (req.body.role !== 'admin' && !value) {
      throw new Error('Room number is required for students');
    }
    return true;
  }),
  body('hostelBlock').trim().custom((value, { req }) => {
    if (req.body.role !== 'admin' && !value) {
      throw new Error('Hostel block is required for students');
    }
    return true;
  }),
  validateResults
];

// Validate login
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateResults
];

// Validate forgot password
const validateForgotPassword = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('securityAnswer').trim().notEmpty().withMessage('Security answer is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  validateResults
];

// Validate complaint creation
const validateComplaint = [
  body('title').trim().notEmpty().withMessage('Complaint title is required'),
  body('description').trim().notEmpty().withMessage('Complaint description is required'),
  body('category')
    .isIn(['Electrical', 'Water', 'Internet', 'Cleaning', 'Furniture', 'Mess', 'Room', 'Security', 'Others'])
    .withMessage('Please specify a valid category'),
  body('priority')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Please specify a valid priority'),
  validateResults
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateComplaint
};
