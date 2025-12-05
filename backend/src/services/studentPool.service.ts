import Group from '../models/Group.model';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
/**
 * Service to manage the special "Student's Own Car Pool" group
 */

// Get or create the Student's Own Car Pool group
export const getOrCreateStudentPoolGroup = async () => {
  try {
    // Try to find existing group
    let studentPoolGroup = await Group.findOne({ groupName: "Student's Own Car Pool" });
    
    // If it doesn't exist, create it
    if (!studentPoolGroup) {
      const chatRoomId = uuidv4();
      
      studentPoolGroup = await Group.create({
        groupName: "Student's Own Car Pool",
        members: [], // Start with no members
        route: {
          pickup: {
            address: "Campus",
            coordinates: [0, 0] // Default coordinates
          },
          drop: {
            address: "Various Locations",
            coordinates: [0, 0] // Default coordinates
          }
        },
        dateTime: new Date(),
        seatCount: 100, // Large capacity group
        status: 'Open',
        chatRoomId,
        description: "A community group for all students who have verified their carpool payments. Connect with fellow students and share rides."
      });
      
      console.log('Created Student\'s Own Car Pool group:', studentPoolGroup._id);
    }
    
    return studentPoolGroup;
  } catch (error) {
    console.error('Error getting or creating Student\'s Own Car Pool group:', error);
    throw error;
  }
};

// Add a user to the Student's Own Car Pool group
export const addUserToStudentPoolGroup = async (userId: string) => {
  try {
    // Get or create the group
    const studentPoolGroup = await getOrCreateStudentPoolGroup();
    
    // Check if user is already a member
    const isMember = studentPoolGroup.members.some(member => 
      member.user.toString() === userId.toString()
    );
    
    // If not a member, add them
    if (!isMember) {
      studentPoolGroup.members.push({
        user: new mongoose.Types.ObjectId(userId),
        role: 'member',
        joinedAt: new Date()
      });
      
      await studentPoolGroup.save();
      console.log(`Added user ${userId} to Student's Own Car Pool group`);
    } else {
      console.log(`User ${userId} is already a member of Student's Own Car Pool group`);
    }
    
    return studentPoolGroup;
  } catch (error) {
    console.error('Error adding user to Student\'s Own Car Pool group:', error);
    throw error;
  }
};