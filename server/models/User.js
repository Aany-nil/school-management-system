const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [30, "Name cannot exceed 30 characters"]
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "student",
        required: [true, "role is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [5, "password must be at least 5 characters"],
        select: false,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
        maxlength: [500, "address cannot exceed 500 characters"],
    },
    address: {
        type: String,
        default: "",
        maxlength: [200, "address cannot exceed 500 characters"],
    }

},
{
    timestamps: true,
}
);

userSchema.pre("save", async function () {
  if(!this.isModified("password")) {
    return;
  } 
  this.password = await bcrypt.hash(this.password, 12)
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", userSchema);