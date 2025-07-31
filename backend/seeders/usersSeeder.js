import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

// Array of 10 fake users (admin user is the first)
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '123456',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: '123456',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: '123456',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: '123456',
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: '123456',
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: '123456',
  },
  {
    name: 'Frank Miller',
    email: 'frank@example.com',
    password: '123456',
  },
  {
    name: 'Grace Lee',
    email: 'grace@example.com',
    password: '123456',
  },
];

const seedUsers = async () => {
  try {
    // Connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clear existing users
    await User.deleteMany();

    // Insert the fake users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedUsers();
