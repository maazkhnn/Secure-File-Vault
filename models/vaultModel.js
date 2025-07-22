const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    // no array of files; vaults dont know what files they have, but files know what vault they belong to 
}, { timestamps: true });
// the special type you see above is how we simulate foreign-key relationships in MongoDB
// the ref:'User' enables the populate() feature of Mongoose - remember: its used to replace the owner ID with the full user object
// Mongoose automatically adds an _id field to every schema

module.exports = mongoose.model('Vault', vaultSchema); //creates the model from the schema