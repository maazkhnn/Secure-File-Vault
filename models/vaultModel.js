const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
    // this is how we simulate foreign-key relationships in MongoDB
}, { timestamps: true });

module.exports = mongoose.model('Vault', vaultSchema); //creates the model from the schema