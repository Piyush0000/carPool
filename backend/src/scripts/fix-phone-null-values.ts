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
      // Use $unset to completely remove the field
      await User.updateOne(
        { _id: user._id },
        { $unset: { phone: "" } }
      );
      console.log(`Fixed user ${user.email} - removed null phone value`);
    }
    
    // Also find users with empty string phone values
    const usersWithEmptyPhone = await User.find({ phone: "" });
    console.log(`Found ${usersWithEmptyPhone.length} users with empty phone values`);
    
    // Update each user to remove the phone field if it's empty
    for (const user of usersWithEmptyPhone) {
      await User.updateOne(
        { _id: user._id },
        { $unset: { phone: "" } }
      );
      console.log(`Fixed user ${user.email} - removed empty phone value`);
    }
    
    // Also find users with "N/A" phone values
    const usersWithNAPhone = await User.find({ phone: "N/A" });
    console.log(`Found ${usersWithNAPhone.length} users with "N/A" phone values`);
    
    // Update each user to remove the phone field if it's "N/A"
    for (const user of usersWithNAPhone) {
      await User.updateOne(
        { _id: user._id },
        { $unset: { phone: "" } }
      );
      console.log(`Fixed user ${user.email} - removed "N/A" phone value`);
    }
    
    console.log('✅ Finished fixing phone values');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing phone values:', error);
    process.exit(1);
  }
};

fixNullPhoneValues();