const mongoose = require('mongoose');

// async function that will connect to MongoDB, log success, handle any errors, and exit if connection fails
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(error);
        process.exit(1); //kill the app
    }
}

module.exports = connectDB;

/* If successful, conn is a giant object that includes connection info, like:
            {
                connection: {
                    host: '127.0.0.1',
                    port: 27017,
                    name: 'myDB',
                    ... // other stuff
                }
            }
*/