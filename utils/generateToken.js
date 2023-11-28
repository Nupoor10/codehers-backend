const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
    return jwt.sign({
        data: userId
    }, SECRET , { expiresIn: '30d' });
}

module.exports = generateToken;