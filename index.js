const express = require('express');
require('dotenv').config();
const app = express();
const users = require('./routes/userRoutes');

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.status(202).send(`Ay yo this port's working on ${PORT}`);
});

app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.send(id);
})

app.get('/users', (req, res) => {
    res.send('Nothing of yet');
});

app.use('/api/users', users);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost.com:${PORT}`);
});