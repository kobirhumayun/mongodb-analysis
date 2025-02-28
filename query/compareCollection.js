const { runAggregation, findDocuments } = require('../helpers/dbQueryHelper');
const { connectDB, closeDB } = require('../config/db');
const { compareData, filterObjectsByPathValue } = require('../utils/objectsComparision');
const { saveArrayOfObjToJsonFile } = require('../utils/fs')
const path = require('path');

const compareCollections = async () => {
  try {
    // Define the database and collections
    const dbName = "test_db";
    const collection1Name = "data_1";
    const collection2Name = "data_2";

    // Define group and value fields for each collection
    const collection1GroupField = "LCNo";
    const collection1ValueField = "InvoiceValue";
    const collection2GroupField = "LCNo";
    const collection2ValueField = "InvoiceValue";

    // Aggregation pipelines for each collection
    const pipeline1 = [
      {
        $group: {
          _id: `$${collection1GroupField}`,
          totalValue: { $sum: `$${collection1ValueField}` }
        }
      }
    ];

    const pipeline2 = [
      {
        $group: {
          _id: `$${collection2GroupField}`,
          totalValue: { $sum: `$${collection2ValueField}` }
        }
      }
    ];

    // Get data for both collections
    const collection1Data = await runAggregation(dbName, collection1Name, pipeline1);
    const collection2Data = await runAggregation(dbName, collection2Name, pipeline2);

    const comparison = compareData(collection1Data, collection2Data, collection1GroupField, collection1Name, collection2Name, "_id", "totalValue");

    // Print the comparison results
    console.log("Comparison Results:");
    comparison.forEach(item => {
      console.log(JSON.stringify(item, null, 2));
    });

    const outputFilePath = path.join(__dirname, '..', '..', 'data', 'comparison.json');
    await saveArrayOfObjToJsonFile(comparison, outputFilePath);
    // Implement your comparison logic here...

  } catch (error) {
    console.error('Error in compareCollections', error);
  } finally {
    // Close the database connection
    await closeDB();
    process.exit(0);
  }
};

// Run the comparison
compareCollections();
