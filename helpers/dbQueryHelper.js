const { connectDB } = require('../config/db');

/**
 * Run aggregation pipeline on a collection
 * @param {string} dbName
 * @param {string} collectionName
 * @param {Array} pipeline
 * @returns {Promise<Object>}
 */
const runAggregation = async (dbName, collectionName, pipeline) => {
  try {
    const db = await connectDB(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error('Error running aggregation', error);
    throw error;
  }
};

/**
 * Perform a simple find query
 * @param {string} collectionName
 * @param {Object} query
 * @param {Object} options
 * @returns {Promise<Array>}
 */
const findDocuments = async (collectionName, query = {}, options = {}) => {
  try {

    const db = await connectDB();
    const collection = db.collection(collectionName);
    const documents = await collection.find(query, options).toArray();
    return documents;
  } catch (error) {
    console.error('Error finding documents', error);
    throw error;
  }
};

module.exports = { runAggregation, findDocuments };
