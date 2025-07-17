const File = require('../models/fileModel');
const Vault = require('../models/vaultModel');

const uploadFile = async (req, res) => {
    try {
        const vault = await Vault.findById(req.params.vaultId);
        if (!vault || vault.owner.toString() !== req.user.userId){
            return res.status(403).json({ error: 'Unauthorized' }); // 403 is Refusal to authorize due to insufficent permissions etc
        }

        const file = await File.create({
            originalName: req.file.originalname, 
            storedName: req.file.filename, // name Multer saved it as
            path: req.file.path,
            vault: vault._id,
            owner: req.user.userId // the currently logged in user
        });

        res.status(201).json({ message: 'File Uploaded', file });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { uploadFile };