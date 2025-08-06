import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';

// New, corrected line
dotenv.config();

const usersToSeed = [
  { username: 'admin', password: 'password123', role: 'Admin' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany({}); // Clear existing users
    console.log('Existing users cleared.');

    console.log('Seeding users... This will trigger password hashing.');
    // Using User.create() for each user ensures the pre-save hook is triggered.
    const creationPromises = usersToSeed.map(user => User.create(user));
    await Promise.all(creationPromises);
    
    console.log('Database seeded successfully with hashed passwords.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();