const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// This file handles user authentication and login
// It accepts user input, validates it, hashes password securely, saves the user to DB
// On login, verifies the password, generates a JWT token for session-less auth

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password )
            return res.status(400).json({ error: 'All fields are required' });

        const existing = await User.findOne({ email });
        if (existing) //checks if email already in DB (we dont want duplicates)
            return res.status(400).json({ error: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, password: hashedPassword });
        //creates a new User document with the hashed password

        res.status(201).json({ message: 'User Registered Successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Server Error'})
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: 'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: 'Invalid Credentials'});

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        // signs a jwt token that contains the user id, using the jst secret key from env

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server Error '});
    }
};

module.exports = { register, login };