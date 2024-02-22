// verifytoken.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, 'hey123@'); // Replace with your secret key
    req.user = decoded; // Add decoded user information to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
