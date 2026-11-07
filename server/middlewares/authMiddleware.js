
const { verifyAccessToken } = require("../helpers/tokenHelpers");
const User = require("../models/User");




async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, please log in",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, invalid or expired token",
        });
    }
}



function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource",
            });
        }

        next();
    };
}


function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    next();
}




function requireSuperAdmin(req, res, next) {
    if (!req.user || req.user.role !== "superadmin") {
        return res.status(403).json({
            success: false,
            message: "Super Admin access required",
        });
    }

    next();
}



module.exports = {
    protect,
    requireRole,
    requireAdmin,
    requireSuperAdmin,
};
