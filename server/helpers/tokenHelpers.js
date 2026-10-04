const crypto = require("crypto");
const jwt = require("jsonwebtoken");



function hashedToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}


function signAccessToken (userId, role) {
  return jwt.sign({ 
    id: userId, 
    role: role, }, 
    process.env.JWT_SECRET, 
    {
    expiresIn: process.env.JWT_SECRET_IN || "2d",
  }
);
}

function verifyAccessToken (token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}


module.exports = { 
     hashedToken,
     signAccessToken,
     verifyAccessToken
 }

