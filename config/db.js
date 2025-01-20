require('dotenv').config();  // Load environment variables from .env

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI; // Use the URI from the .env file

let dbConnection = null;

const connectDB = async (dbName) => {
  if (dbConnection) return dbConnection;

  try {

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const connection = await client.connect();
    dbConnection = connection.db(dbName);
    console.log('Database connected');
    return dbConnection;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
};

module.exports = { connectDB };
