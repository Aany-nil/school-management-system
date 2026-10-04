const { verifyAccessToken } = require("../helpers/tokenHelpers");
const User = require("../models/User");

async function protect (req, res, next) {
    try {
       const authHeader = req.headers.authorization;
       
       if(!authHeader || !authHeader.startsWith("Bearer") ) {
        return res.status(401).json({
            success: false,
            message: "not authorized, please log in"
        });
       }

       const token = authHeader.split(" ") [1];
       const decoded = verifyAccessToken(token);

       const user = await User.findById(decoded.id);

       if(!user) {
        return res.status(401).json({
            success: false,
            message: "user no long exists"
        })
       }
       req.user = user;
       next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "not authorized, invalid or expire token"
        })
    }
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if(allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
             success: false,
             message: "you are not authorized to access this resource"   
            });
        }
     next();

    }
}

function requireAdmin(req, res, next) {
    if(req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "admin access required"
        })
    }
    next();
}


module.exports = {
    protect,
    requireRole,
    requireAdmin,
}