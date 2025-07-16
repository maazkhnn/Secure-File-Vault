const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });
//Mongoose automatically adds an _id field to every schema

module.exports = mongoose.model('User', userSchema); // creates the model from the schema
