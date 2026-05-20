const mongoose = require('mongoose');

/**
 * CONNECT DB CONCEPT:
 * In a production environment, we never hardcode the database URL. 
 * We use environment variables (process.env) for security.
 * 
 * WHY USE ASYNC/AWAIT?
 * Database connections take time. By using 'async', we ensure the 
 * server waits for a successful connection before proceeding.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error.message.includes('authentication failed')) {
            console.error('❌ MongoDB Auth Error: Your username or password in MONGO_URI is incorrect.');
            console.error('👉 Tip: Check your Atlas "Database Access" user and ensure special characters are URL-encoded.');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.error('❌ MongoDB Connection Error: Could not connect to the database server.');
        } else {
            console.error(`❌ MongoDB Error: ${error.message}`);
        }
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
