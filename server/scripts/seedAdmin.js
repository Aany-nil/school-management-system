
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const dbConnection = require("../configaration/dbConnection");

const seedAdmin = async () => {
  try {
    // Connect to MongoDB using your existing connection
    await dbConnection();

    // Check whether an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists. No new admin created.");
      return;
    }

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Please set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env"
      );
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();

    // Check whether this email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already belongs to another account. Use a different email."
      );
    }

    // Create the first admin
    // The User model's pre-save hook will hash the password.
    const admin = await User.create({
      name: ADMIN_NAME.trim(),
      email,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("First admin created successfully!");
    console.log("Admin email:", admin.email);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
