
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const User = require("../models/User");
const Setting = require("../models/Setting");




const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    const admin = await User.findById(req.user._id).select(
      "name email profilePicture"
    );

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data: {
        school: settings,
        admin: admin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateSettings = async (req, res) => {
  try {
    const {
      schoolName,
      schoolEmail,
      schoolPhone,
      schoolAddress,
      schoolLogo,
      academicYear,
      currentSession,
      semester,
      language,
      timezone,
      dateFormat,
    } = req.body;

    const allowedUpdates = {
      schoolName,
      schoolEmail,
      schoolPhone,
      schoolAddress,
      schoolLogo,
      academicYear,
      currentSession,
      semester,
      language,
      timezone,
      dateFormat,
    };


    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide settings to update",
      });
    }

    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create(allowedUpdates);
    } else {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        { $set: allowedUpdates },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Admin name cannot be empty",
        });
      }

      updates.name = name.trim();
    }

    if (email !== undefined) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email",
        });
      }

      updates.email = email.trim().toLowerCase();
    }

    if (profilePicture !== undefined) {
      updates.profilePicture = profilePicture;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide profile information to update",
      });
    }

    const admin = await User.findOneAndUpdate(
      { _id: req.user._id, role: "admin" },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email profilePicture role");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      data: admin,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all password fields",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const admin = await User.findOne({
      _id: req.user._id,
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get School Information (Admin, Teacher, Student)
const getSchoolInfo = async (req, res) => {
  try {
    const settings = await Setting.findOne().select(
      "schoolName schoolLogo schoolAddress schoolEmail schoolPhone academicYear currentSession"
    );

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "School information not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "School information fetched successfully",
      data: {
        school: settings,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getSettings,
  updateSettings,
  updateAdminProfile,
  updateAdminPassword,
  getSchoolInfo
};
