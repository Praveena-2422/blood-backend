const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRES_IN = '24h';

const generateToken = (donorId) => {
  return jwt.sign(
    { donorId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

module.exports = {
  generateToken,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
