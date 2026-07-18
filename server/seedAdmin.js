require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@hostelcare.com';

    // Delete old admin if it exists
    await User.deleteOne({ email: adminEmail });

    const adminUser = await User.create({
      name: 'Hostel Admin',
      email: adminEmail,
      password: 'Admin@123', // DON'T hash it here
      securityQuestion: 'What is your favorite color?',
      securityAnswer: 'blue', 
      phone: '+919999999999',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
      role: 'admin'
    });

    console.log('✅ Admin created successfully');
    console.log('Email:', adminUser.email);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();