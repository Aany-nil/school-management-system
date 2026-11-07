
const School = require("../models/School");



const createSchool = async (req, res) => {
  try {
    const { schoolName, schoolCode, email, phone, address, logo } = req.body;

    if (!schoolName || !schoolCode) {
      return res.status(400).json({
        success: false,
        message: "School name and school code are required",
      });
    }

    const existingSchool = await School.findOne({
      schoolCode: schoolCode.trim().toUpperCase(),
    });

    if (existingSchool) {
      return res.status(409).json({
        success: false,
        message: "This school code already exists",
      });
    }

    const school = await School.create({
      schoolName,
      schoolCode,
      email,
      phone,
      address,
      logo,
    });

    return res.status(201).json({
      success: true,
      message: "School created successfully",
      school,
    });
  } catch (error) {
    console.error("Create school error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create school",
      error: error.message,
    });
  }
};



const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find()
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: schools.length,
      schools,
    });
  } catch (error) {
    console.error("Get all schools error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get schools",
      error: error.message,
    });
  }
};




const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate("adminId", "name email");

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    return res.status(200).json({
      success: true,
      school,
    });
  } catch (error) {
    console.error("Get school error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get school",
      error: error.message,
    });
  }
};




const updateSchool = async (req, res) => {
  try {
    const { schoolName, schoolCode, email, phone, address, logo } = req.body;

    const school = await School.findById(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    if (schoolCode) {
      const existingSchool = await School.findOne({
        schoolCode: schoolCode.trim().toUpperCase(),
        _id: { $ne: school._id },
      });

      if (existingSchool) {
        return res.status(409).json({
          success: false,
          message: "This school code already exists",
        });
      }

      school.schoolCode = schoolCode;
    }

    if (schoolName !== undefined) school.schoolName = schoolName;
    if (email !== undefined) school.email = email;
    if (phone !== undefined) school.phone = phone;
    if (address !== undefined) school.address = address;
    if (logo !== undefined) school.logo = logo;

    await school.save();

    return res.status(200).json({
      success: true,
      message: "School updated successfully",
      school,
    });
  } catch (error) {
    console.error("Update school error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update school",
      error: error.message,
    });
  }
};




const updateSchoolStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive",
      });
    }

    const school = await School.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `School ${status} successfully`,
      school,
    });
  } catch (error) {
    console.error("Update school status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update school status",
      error: error.message,
    });
  }
};




const updateSchoolModules = async (req, res) => {
  try {
    const { modules } = req.body;

    if (!modules || typeof modules !== "object" || Array.isArray(modules)) {
      return res.status(400).json({
        success: false,
        message: "Valid modules object is required",
      });
    }

    const allowedModules = [
      "students",
      "teachers",
      "classesSubjects",
      "attendanceResults",
      "feesSalaries",
      "routineNotices",
      "settings",
    ];

    const updateFields = {};

    for (const key of Object.keys(modules)) {
      if (!allowedModules.includes(key)) {
        return res.status(400).json({
          success: false,
          message: `Invalid module: ${key}`,
        });
      }

      if (typeof modules[key] !== "boolean") {
        return res.status(400).json({
          success: false,
          message: `${key} must be true or false`,
        });
      }

      updateFields[`modules.${key}`] = modules[key];
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one module must be provided",
      });
    }

    const school = await School.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "School modules updated successfully",
      school,
    });
  } catch (error) {
    console.error("Update school modules error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update school modules",
      error: error.message,
    });
  }
};

module.exports = {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  updateSchoolStatus,
  updateSchoolModules,
};
