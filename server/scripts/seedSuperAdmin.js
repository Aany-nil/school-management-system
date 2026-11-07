
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const dbConnection = require("../configaration/dbConnection");

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await dbConnection();

    // Check whether a Super Admin already exists
    const existingSuperAdmin = await User.findOne({
      role: "superadmin",
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists. No new Super Admin created.");
      return;
    }

    const {
      SUPERADMIN_NAME,
      SUPERADMIN_EMAIL,
      SUPERADMIN_PASSWORD,
    } = process.env;

    if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      throw new Error(
        "Please set SUPERADMIN_NAME, SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD in .env"
      );
    }

    const email = SUPERADMIN_EMAIL.trim().toLowerCase();

    // Check whether this email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already belongs to another account. Use a different email."
      );
    }

    // Create the Super Admin
    const superAdmin = await User.create({
      name: SUPERADMIN_NAME.trim(),
      email,
      password: SUPERADMIN_PASSWORD,
      role: "superadmin",
      schoolId: null,
    });

    console.log("Super Admin created successfully!");
    console.log("Super Admin email:", superAdmin.email);
  } catch (error) {
    console.error("Super Admin seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

seedSuperAdmin();
