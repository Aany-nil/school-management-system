const { signAccessToken } = require("../helpers/tokenHelpers");
const User = require("../models/User");

const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "name, email and password are required",
            });
        }

        if (password.length < 5) {
            return res.status(400).json({
                success: false,
                message: "password must be at least 5 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "an account with this email exists"
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "student"
        });

        const token = signAccessToken(user._id, user.role);

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
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors)
                .map((error) => error.message)
                .join(",");

            return res.status(400).json({
                success: false,
                message,
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "an account with this email exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "registration failed",
            error: error.message,
        });
    }
};


const login = async (req, res) => {
    try {
       const { email, password } = req.body;

       if(!email || !password) {
       return res.status(400).json({
        success: false,
        message: "email and password are required"
        });
       }
       const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

       if(!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
            success: false,
            message: "invalid email or password"
        });
       }

       const token = signAccessToken(user._id, user.role);

       return res.status(200).json({
        success: true,
        message: "login successful",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                bio: user.bio,
                address: user.address,
            },
            token,
         }
       });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "login failed",
            error: error.message
        })
        
    }
}


const adminSetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (password.length < 5 ) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login again.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Password update failed.",
    });
  }
};



module.exports = { 
    registration,
    login, 
    adminSetPassword 
}