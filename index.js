const express = require('express');
require('dotenv').config();
// this immediately loads and runs the config() function
// compared to "const dotenv = require('dotenv'); dotenv.config();" which is the
// same thing but lets you access dotenv later if you need it or want more control
// (like using a .env.local file or checking if .env loaded successfully) then use this
const app = express();
const users = require('./routes/userRoutes');

const PORT = process.env.PORT || 4000; // fallback makes sure the app still runs w/out .env
// common dev ports for web serves/apis: 3000, 4000, 5000
// common alternatives, sometimes used for proxies or test apis: 8080, 8888
// reserved for production HTTP/HTTPS: 80, 443 (you usually dont use these for local dev)

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the SafeHouse API');
});

//app.get('/', (req, res) => {res.status(202).send(`Ay yo this port's working on ${PORT}`);});

app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.send(id);
})

app.get('/users', (req, res) => {
    res.send('Nothing of yet');
});

app.use('/api/users', users);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`); // it's NOT localhost.com, that's a real domain
});