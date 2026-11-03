const User = require("../models/User");
const cloudinary = require("../configaration/cloudinary");



const getMyProfile = async (req, res) => {

  try {
    const user = await User.findById(req.user._id).select(
      "name email role profilePicture bio address classId"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const updateMyProfile = async (req, res) => {
  try {
    const { name, email, bio, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      if (name.trim().length > 30) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 30 characters",
        });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }

      user.email = normalizedEmail;
    }

    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Bio cannot exceed 500 characters",
        });
      }

      user.bio = bio.trim();
    }

    if (address !== undefined) {
      if (address.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Address cannot exceed 200 characters",
        });
      }

      user.address = address.trim();
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "name email role profilePicture bio address classId"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "school-management/profiles",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePicture: result.secure_url,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email role profilePicture bio address");

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadProfilePicture
};