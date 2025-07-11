const getVaults = (req, res) => {
    res.json([
        { id: 1, name: 'Personal Vault', owner: 'user123'},
        { id: 2, name: 'Work Vault', owner: 'user123'}
    ]);
};

const createVaults = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    res.status(201).json({ message: `Vault: ${name} created` });
    // 201: The request was successful and resulted in a new resource being CREATED
    // 200: The request succeeded, and the server is RETURNING some result
    // 204: Success, but no response body (e.g. DELETE success)
}

module.exports = { getVaults, createVaults };

/*
router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'John Smith'}]); //res.send sends the same because of the nature of the content itself(its in JSON)
});
*/