require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { summarizeComplaint } = require('./aiSummarizer');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_complaints';
    await mongoose.connect(mongoUri);
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    await Notification.deleteMany();
    console.log('Cleared existing records.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Hostel Chief Warden',
      email: 'admin@hostel.com',
      password: 'admin123', // Will be hashed by User pre-save middleware
      phone: '+19876543210',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
      role: 'admin'
    });

    // Create Student User
    const studentUser = await User.create({
      name: 'Aravind Swamy',
      email: 'student@hostel.com',
      password: 'student123', // Will be hashed
      roomNumber: '204-B',
      hostelBlock: 'C Block',
      phone: '+919988776655',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
      role: 'student'
    });

    // Create seed complaints
    const complaintsData = [
      {
        title: 'Water leaking from toilet flush tank',
        description: 'The flush tank in my room bathroom is leaking continuously, making the toilet floor extremely wet and slippery. It is wasting water.',
        category: 'Water',
        priority: 'High',
        status: 'Pending',
        student: studentUser._id,
        images: []
      },
      {
        title: 'Ceiling fan making squeaking noise',
        description: 'The ceiling fan in my room makes a very loud squeaking noise when run on high speed, which prevents me from sleeping or studying.',
        category: 'Electrical',
        priority: 'Medium',
        status: 'Accepted',
        student: studentUser._id,
        images: []
      },
      {
        title: 'Extremely slow Wi-Fi connection',
        description: 'Wi-Fi connection speeds are below 1 Mbps in the evening, making it impossible to access online lectures and programming portals.',
        category: 'Internet',
        priority: 'Low',
        status: 'Resolved',
        student: studentUser._id,
        assignedStaff: 'IT Support Team',
        images: []
      },
      {
        title: 'Study desk leg is broken',
        description: 'One of the legs of the wooden study table in room 204-B is loose and about to fall off. The desk is wobbling.',
        category: 'Furniture',
        priority: 'Medium',
        status: 'In Progress',
        student: studentUser._id,
        assignedStaff: 'Woodwork Unit',
        images: []
      }
    ];

    for (let c of complaintsData) {
      c.aiSummary = summarizeComplaint(c.title, c.description);
      await Complaint.create(c);
    }
    console.log('Seed complaints successfully created.');

    // Seed notifications
    await Notification.create({
      user: studentUser._id,
      message: 'Welcome to the Hostel Complaint Management Portal! You can now raise issues and track them in real time.',
      read: false
    });
    await Notification.create({
      user: studentUser._id,
      message: 'Your Wi-Fi complaint has been updated to Resolved by Admin.',
      read: true
    });
    console.log('Seed notifications created.');

    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
