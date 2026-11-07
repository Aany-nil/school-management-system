
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [30, "Name cannot exceed 30 characters"],
    },

    role: {
      type: String,
      enum: ["superadmin", "admin", "teacher", "student"],
      default: "student",
      required: [true, "Role is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must be at least 5 characters"],
      select: false,
    },

  

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      default: null,
      index: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    address: {
      type: String,
      default: "",
      maxlength: [200, "Address cannot exceed 200 characters"],
    },


    fatherName: {
      type: String,
      trim: true,
      default: "",
      maxlength: [50, "Father name cannot exceed 50 characters"],
    },

    motherName: {
      type: String,
      trim: true,
      default: "",
      maxlength: [50, "Mother name cannot exceed 50 characters"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      default: "",
    },

    religion: {
      type: String,
      trim: true,
      default: "",
      maxlength: [30, "Religion cannot exceed 30 characters"],
    },

    presentAddress: {
      type: String,
      trim: true,
      default: "",
      maxlength: [300, "Present address cannot exceed 300 characters"],
    },

    permanentAddress: {
      type: String,
      trim: true,
      default: "",
      maxlength: [300, "Permanent address cannot exceed 300 characters"],
    },

    nidNumber: {
      type: String,
      trim: true,
      default: "",
      select: false,
      maxlength: [30, "NID number cannot exceed 30 characters"],
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },

    rollNumber: {
      type: String,
      trim: true,
    },

    monthlySalary: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { classId: 1, rollNumber: 1 },
  {
      unique: true,
      partialFilterExpression: {
      role: "student",
      rollNumber: { $type: "string" },
    },
  }
);



userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});



userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
  
};




module.exports = mongoose.model("User", userSchema);
