import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import config from '../config';

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixNullPhoneValues = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Find all users with null phone values
    const usersWithNullPhone = await User.find({ phone: null });
    console.log(`Found ${usersWithNullPhone.length} users with null phone values`);
    
    // Update each user to remove the phone field if it's null
    for (const user of usersWithNullPhone) {
      await User.updateOne(
        { _id: user._id },
        { $unset: { phone: "" } }
      );
      console.log(`Fixed user ${user.email} - removed null phone value`);
    }
    
    console.log('✅ Finished fixing null phone values');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing null phone values:', error);
    process.exit(1);
  }
};

fixNullPhoneValues();