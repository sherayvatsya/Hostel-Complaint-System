const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    securityQuestion: {
      type: String,
      required: [true, 'Please select a security question']
    },
    securityAnswer: {
      type: String,
      required: [true, 'Please provide a security answer'],
      select: false
    },
    roomNumber: {
      type: String,
      required: function() { return this.role === 'student'; },
      trim: true
    },
    hostelBlock: {
      type: String,
      required: function() { return this.role === 'student'; },
      trim: true
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Hash password and security answer before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') && !this.isModified('securityAnswer')) {
    return next();
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified('securityAnswer')) {
    const salt = await bcrypt.genSalt(10);
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
  }

  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare security answer method
UserSchema.methods.matchSecurityAnswer = async function(enteredAnswer) {
  return await bcrypt.compare(enteredAnswer, this.securityAnswer);
};

module.exports = mongoose.model('User', UserSchema);
