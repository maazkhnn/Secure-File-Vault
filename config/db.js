const mongoose = require('mongoose');
require('colors');

// async function that will connect to MongoDB, log success, handle any errors, and exit if connection fails
const connectDB = async () => {
    try {
        const dbName = process.env.MONGO_DB_NAME || 'safehouseDB';
        const conn = await mongoose.connect(process.env.MONGO_URI, { dbName });
        console.log(`MongoDB Connected to db: ${conn.connection.name}`.cyan.underline);
    } catch (error) {
        console.error(error);
        process.exit(1);
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