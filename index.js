const express = require('express');
const colors = require('colors');
const mongoose = require ('mongoose'); //(you only need to run npm install mongoose, as it is built on top of the MongoDB driver, so it automatically installs mongodb as a dependancy behind the scenes)
require('dotenv').config();
// this immediately loads and runs the config() function
// compared to "const dotenv = require('dotenv'); dotenv.config();" which is the
// same thing but lets you access dotenv later if you need it or want more control
// (like using a .env.local file or checking if .env loaded successfully) then use this
const app = express();
const PORT = process.env.PORT || 4000; // fallback makes sure the app still runs w/out .env
// common dev ports for web serves/apis: 3000, 4000, 5000
// common alternatives, sometimes used for proxies or test apis: 8080, 8888
// reserved for production HTTP/HTTPS: 80, 443 (you usually dont use these for local dev)

// Middleware
app.use(express.json());

/* mongoose.connect(process.env.MONGO_URI) // this returns a Promise
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB Connection error:', err)); // when .catch() runs, it automatically receives the error that caused the promise to fail — and you get to name that error whatever you want, so "err"
    
    // handling promises with:
    // .then().catch() -> old school, works fine
    // async/await -> cleaner, preferred for bigger apps
*/

const connectDB = require('./config/db');
const vaultRoutes = require('./routes/vaultRoutes');
const authRoutes = require('./routes/authRoutes');
//const userRoutes = require('./routes/userRoutes');

//MongoDB Connection
connectDB(); //recommended style for real apps

/* mongoose.connect(process.env.MONGO_URI) // this returns a Promise
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB Connection error:', err)); // when .catch() runs, it automatically receives the error that caused the promise to fail — and you get to name that error whatever you want, so "err"
    
    // handling promises with:
    // .then().catch() -> old school, works fine
    // async/await -> cleaner, preferred for bigger apps
*/

//Routes
app.use('/api/vaults', vaultRoutes);
app.use('/auth', authRoutes);
//app.use('/api/users', userRoutes); dont need this as of yet(creation already in auth)

app.get('/', (req, res) => {
    res.send('Welcome to the SafeHouse API');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`); // it's NOT localhost.com, that's a real domain
});

/*
//app.get('/', (req, res) => {res.status(202).send(`Ay yo this port's working on ${PORT}`);});
app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.send(id);
})
app.get('/users', (req, res) => {
    res.send('Nothing of yet');
});
app.use('/api/users', users);
*/