const mongoose = require("mongoose");

const seedUsers = async () => {
  const User = require("../models/User");

  const count = await User.countDocuments();

  if (count > 0) return;

  const defaultUsers = [
    {
      name: "Admin",
      email: "admin@pitshield.com",
      password: "admin123",
      role: "admin",
      phone: "9876543210",
    },
    {
      name: "User",
      email: "user@pitshield.com",
      password: "user123",
      role: "user",
      phone: "9876543211",
    },
    {
      name: "Team Alpha",
      email: "maint@pitshield.com",
      password: "maint123",
      role: "maintenance",
      phone: "9876543212",
    },
  ];

  await User.create(defaultUsers);

  console.log("Default users seeded successfully");
};

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");

    await seedUsers();
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;