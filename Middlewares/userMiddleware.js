const jwt = require('jsonwebtoken')
const User = require('../Models/User')
//Protected Route token here
  const requireLogIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
 const admin = async (req, res, next) => { 
  try {
    console.log(req.auth)
    const admin = await User.findById(req.auth.userId);
    if (!admin || admin.role !== 1) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error in admin Middleware'
    });
  }
}
module.exports = { admin ,requireLogIn }