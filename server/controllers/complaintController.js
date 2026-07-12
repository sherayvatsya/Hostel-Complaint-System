const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { summarizeComplaint } = require('../utils/aiSummarizer');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student only)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    // Handle image file uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Generate AI Summary
    const aiSummary = summarizeComplaint(title, description);

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      images,
      student: req.user._id,
      aiSummary
    });

    // Create Notification
    await Notification.create({
      user: req.user._id,
      message: `Your complaint "${title}" has been registered successfully. Track updates on your dashboard.`
    });

    res.status(201).json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error creating complaint' });
  }
};

// @desc    Get logged in student's complaints
// @route   GET /api/complaints
// @access  Private (Student only)
const getMyComplaints = async (req, res) => {
  try {
    const { search, category, status, priority } = req.query;
    
    // Base query filter
    let query = { student: req.user._id };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
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

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

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

// @desc    Get complaint details by ID
// @route   GET /api/complaints/:id
// @access  Private (Student or Admin)
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email roomNumber hostelBlock phone avatar');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Verify ownership (or let admins access)
    if (
      complaint.student._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
    }

    res.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving complaint details' });
  }
};

// @desc    Update a complaint
// @route   PUT /api/complaints/:id
// @access  Private (Student only, when Pending)
const updateComplaint = async (req, res) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Verify ownership
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this complaint' });
    }

    // Check if complaint is still Pending
    if (complaint.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a complaint that has already been accepted or processed'
      });
    }

    const { title, description, category, priority } = req.body;

    // Handle new uploads (append or replace)
    let images = complaint.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    // Regenerate AI Summary if title/description changed
    let aiSummary = complaint.aiSummary;
    if (title || description) {
      aiSummary = summarizeComplaint(title || complaint.title, description || complaint.description);
    }

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.category = category || complaint.category;
    complaint.priority = priority || complaint.priority;
    complaint.images = images;
    complaint.aiSummary = aiSummary;

    const updatedComplaint = await complaint.save();

    res.json({
      success: true,
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating complaint' });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Student only, when Pending)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Verify ownership
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this complaint' });
    }

    // Check if complaint is still Pending
    if (complaint.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a complaint that has already been accepted or processed'
      });
    }

    await complaint.deleteOne();

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error deleting complaint' });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
};
