
const User = require("../models/User");
const cloudinary = require("../configaration/cloudinary");

// Fields returned in the authenticated user's own profile
const profileFields =
  "name email role profilePicture bio address classId " +
  "fatherName motherName phone dateOfBirth bloodGroup religion " +
  "presentAddress permanentAddress +nidNumber";

// Get My Profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(profileFields);

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

// Update My Profile
const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      bio,
      address,
      fatherName,
      motherName,
      phone,
      dateOfBirth,
      bloodGroup,
      religion,
      presentAddress,
      permanentAddress,
      nidNumber,
    } = req.body;

    const user = await User.findById(req.user._id).select("+nidNumber");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Name Validation
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
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

    // Email Validation
    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

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

    // Bio
    if (bio !== undefined) {
      if (typeof bio !== "string" || bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Bio cannot exceed 500 characters",
        });
      }

      user.bio = bio.trim();
    }

    // Old Address Field (Backward Compatibility)
    if (address !== undefined) {
      if (typeof address !== "string" || address.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Address cannot exceed 200 characters",
        });
      }

      user.address = address.trim();
    }

    // Personal Information Fields
    const textFields = {
      fatherName: 50,
      motherName: 50,
      phone: 20,
      religion: 30,
      presentAddress: 300,
      permanentAddress: 300,
      nidNumber: 30,
    };

    for (const [field, maxLength] of Object.entries(textFields)) {
      if (req.body[field] !== undefined) {
        const value = req.body[field];

        if (typeof value !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be a string`,
          });
        }

        if (value.trim().length > maxLength) {
          return res.status(400).json({
            success: false,
            message: `${field} cannot exceed ${maxLength} characters`,
          });
        }

        user[field] = value.trim();
      }
    }

    // Date of Birth
    if (dateOfBirth !== undefined) {
      if (dateOfBirth === "" || dateOfBirth === null) {
        user.dateOfBirth = null;
      } else {
        const parsedDate = new Date(dateOfBirth);

        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid date of birth",
          });
        }

        if (parsedDate > new Date()) {
          return res.status(400).json({
            success: false,
            message: "Date of birth cannot be in the future",
          });
        }

        user.dateOfBirth = parsedDate;
      }
    }

    // Blood Group
    if (bloodGroup !== undefined) {
      const allowedBloodGroups = [
        "",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ];

      if (
        typeof bloodGroup !== "string" ||
        !allowedBloodGroups.includes(bloodGroup)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid blood group",
        });
      }

      user.bloodGroup = bloodGroup;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(profileFields);

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

// Upload Profile Picture
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
    ).select(
      "name email role profilePicture bio address fatherName motherName phone dateOfBirth bloodGroup religion presentAddress permanentAddress"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
  uploadProfilePicture,
};
