const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
    // this is how we simulate foreign-key relationships in MongoDB
    // the ref:'User' enables the populate() feature of Mongoose - remember: its used to replace the owner ID with the full user object
}, { timestamps: true });
//Mongoose automatically adds an _id field to every schema

module.exports = mongoose.model('Vault', vaultSchema); //creates the model from the schema