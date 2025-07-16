const Vault = require('../models/vaultModel'); // naming convention for constructor function/class-like object
// in this case, a Mongoose model (remember the creating model from the schema line)


// GET vaults from DB
const getVaults = async (req, res) => {
    try {
        const vaults = await Vault.find({ owner: req.user.userID });
        // Vault.find() gets all vaults
        res.status(200).json(vaults);
    } catch(error) {
        res.status(500).json({ error: 'Failed to get vaults (Server error)'});
    }
};

// POST a new vault in DB
const createVaults = async (req, res) => {
    try {
        const { name } = req.body;
        const newVault = await Vault.create({ name, owner: req.user.userID });
        res.status(201).json(newVault);
    } catch(error) {
        res.status(500).json({ error: 'Failed to create vault'});
    }
    // 201: The request was successful and resulted in a new resource being CREATED
    // 200: The request succeeded, and the server is RETURNING some result
    // 204: Success, but no response body (e.g. DELETE success)
};

module.exports = { getVaults, createVaults };

/*
router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'John Smith'}]); //res.send sends the same because of the nature of the content itself(its in JSON)
});
*/