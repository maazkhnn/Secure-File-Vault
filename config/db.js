const mongoose = require('mongoose');

// async function that will connect to MongoDB, log success, handle any errors, and exit if connection fails
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
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
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(error);
        process.exit(1); //kill the app
    }
}

module.exports = connectDB;

/*
Why this pattern is better than inline .then().catch()
| Aspect             | This Pattern (`connectDB`)                | `.then().catch()` in index.js |
| ------------------ | ----------------------------------------- | ----------------------------- |
| **Modularity**     | ✅ Reusable, isolated                      | ❌ Harder to reuse             |
| **Readability**    | ✅ Cleaner separation                      | ❌ Mixes logic and setup       |
| **Error Handling** | ✅ Centralized try/catch                   | ✅ Still good with `.catch()`  |
| **Scalability**    | ✅ Easy to expand (e.g. retry logic, logs) | ❌ Becomes messy with growth   |
*/