const { signAccessToken } = require("../helpers/tokenHelpers");
const User = require("../models/User");

const registration = async (req, res) => {
    try {
        const { name, email, role, password, } = req.body;

        if(!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "name, email, password and role are required",
            });
        }
        if(password.length < 5) {
            return res.status(400).json({
                success: false,
                message: "password must be at least 5 characters"
            });
        }

        const validedRole = ["admin", "teacher", "student"]

        if(!validedRole.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "invalid role"
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if(existingUser) {
            return res.status(409).json({
                success: false,
                message: "an account with this email exists"
            });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role
        });

        const token = signAccessToken(user._id);
        return res.status(201).json({
            success: true,
            message: "registration is successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            }
        })
    } catch (error) {
        if(error.name === "validationError") {
          const message = Object.values(error.errors).map((error) => error.message).join(",");
          
          return res.status(400).json({
            success: false,
            message,
          });
        }

        return res.status(500).json({
            success: false,
            message: "registration failed",
            error: error.message,
        });
    }
}


module.exports = { registration }