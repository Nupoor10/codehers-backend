const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const userRegister = async (req,res) => {
    try {
        const { name, email, password, userType } = req.body;

        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res.status(409).json({
                message : 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(500).json({
                message : 'Password could not be hashed'
            });
        }

        const validUsers = ['student', 'teacher', 'admin'];
        const currentUserType = userType.toLowerCase();

        if(!validUsers.includes(currentUserType)) {
            return res.status(500).json({
                message: 'Invalid User Type'
            });
        }

        const user =  await new User(
            {
                name,
                email,
                password : hashedPassword,
                userType: currentUserType
            }
        );
        await user.save();

        return res.status(201).json({
            message : 'User created successfully',
            user
        });
    }
    catch(error) {
        console.error(error);
        return res.status(500).send({
            message : "User Registration Unsuccessful",
            error: error.message
        });
    }
}

const userLogin = async (req,res) => {
    try {
        const { email, password } = req.body;
        const exisitingUser = await User.findOne({email : email});
        if (!exisitingUser) {
            return res.status(404).json({
                message : 'User not found'
            });
        }

        const hashedPassword = exisitingUser.password;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if(!isPasswordCorrect) {
            return res.status(401).json({
                message : 'Incorrect Password'
            });
        }

        const token = generateToken(exisitingUser._id);
        if (!token) {
            return res.status(500).json({
                message : 'Error creating JWT Token'
            });
        }

        return res.status(200).json({
            message : 'User Logged in successfully',
            exisitingUser,
            token,
        });
    }
    catch(error) {
        console.error(error)
        return res.status(500).send({
            message : "User Login Unsuccessful",
            error: error.message
        });
    }
}

module.exports = {
    userRegister,
    userLogin,
}