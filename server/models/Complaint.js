const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a complaint title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a complaint description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Electrical',
        'Water',
        'Internet',
        'Cleaning',
        'Furniture',
        'Mess',
        'Room',
        'Security',
        'Others'
      ],
      default: 'Others'
    },
    priority: {
      type: String,
      required: [true, 'Please select a priority'],
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Accepted', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    images: {
      type: [String],
      default: []
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedStaff: {
      type: String,
      default: ''
    },
    aiSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);
