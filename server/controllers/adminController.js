const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalComplaints = await Complaint.countDocuments();
    
    // Status counts
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const accepted = await Complaint.countDocuments({ status: 'Accepted' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });

    // Category breakdown
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Priority breakdown
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent complaints (last 5)
    const recentComplaints = await Complaint.find()
      .populate('student', 'name roomNumber hostelBlock avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalComplaints,
        status: {
          pending,
          accepted,
          inProgress,
          resolved,
          rejected
        },
        categories: categoryStats,
        priorities: priorityStats,
        recentComplaints
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard metrics' });
  }
};

// @desc    Get all complaints (with filters, search & pagination)
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
const getAllComplaints = async (req, res) => {
  try {
    const { search, category, status, priority, exportData } = req.query;

    let query = {};

    // Search filter (handles Student name search or title/description search)
    if (search) {
      // Find students matching the search query to get their IDs
      const matchingStudents = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const studentIds = matchingStudents.map(s => s._id);

      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { student: { $in: studentIds } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    let queryBuilder = Complaint.find(query)
      .populate('student', 'name email roomNumber hostelBlock phone avatar')
      .sort({ createdAt: -1 });

    // If exporting, fetch all matching complaints without limit
    const complaints = await queryBuilder;

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving complaints' });
  }
};

// @desc    Update complaint status & assign staff
// @route   PUT /api/admin/complaints/:id/status
// @access  Private (Admin only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedStaff } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status update value' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    if (assignedStaff !== undefined) {
      complaint.assignedStaff = assignedStaff;
    }

    await complaint.save();

    // Notify student about status change
    await Notification.create({
      user: complaint.student,
      message: `Your complaint "${complaint.title}" status has been updated to "${status}"${assignedStaff ? ` and assigned to "${assignedStaff}"` : ''}.`
    });

    res.json({
      success: true,
      message: 'Complaint status updated and notification dispatched',
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

// @desc    Get all users (students only)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer, phone, roomNumber, hostelBlock, avatar, role } = req.body;

    if (!name || !email || !password || !phone || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ success: false, message: 'Name, email, password, phone, security question, and answer are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user with that email already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
      phone,
      roomNumber: role === 'admin' ? undefined : roomNumber,
      hostelBlock: role === 'admin' ? undefined : hostelBlock,
      avatar: avatar || '',
      role: role || 'student'
    });

    res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        roomNumber: newUser.roomNumber,
        hostelBlock: newUser.hostelBlock,
        phone: newUser.phone,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error creating user account' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving users' });
  }
};

// @desc    Delete user & all their associated complaints
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin accounts cannot be deleted' });
    }

    // Delete student complaints
    await Complaint.deleteMany({ student: user._id });
    
    // Delete student notifications
    await Notification.deleteMany({ user: user._id });

    // Delete student
    await user.deleteOne();

    res.json({
      success: true,
      message: 'Student account and all associated complaints removed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error deleting student profile' });
  }
};

// @desc    Delete complaint as admin
// @route   DELETE /api/admin/complaints/:id
// @access  Private (Admin only)
const adminDeleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({
      success: true,
      message: 'Complaint deleted successfully by Administrator'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error deleting complaint' });
  }
};

module.exports = {
  getAdminStats,
  getAllComplaints,
  updateComplaintStatus,
  createUser,
  getAllUsers,
  deleteUser,
  adminDeleteComplaint
};
