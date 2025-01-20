const { runAggregation, findDocuments } = require('../helpers/dbQueryHelper');

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
    const collection1Data = await runAggregation(dbName, 'data_1', pipeline1);
    const collection2Data = await runAggregation(dbName, 'data_2', pipeline2);

    // Perform comparison logic on collection1Data and collection2Data
    // Convert results to dictionaries for easy lookup
    const results1Dict = Object.fromEntries(collection1Data.map(item => [item._id, item.totalValue]));
    const results2Dict = Object.fromEntries(collection2Data.map(item => [item._id, item.totalValue]));

    // Compare the results
    const comparison = [];

    const allKeys = new Set([...Object.keys(results1Dict), ...Object.keys(results2Dict)]);

    allKeys.forEach(key => {
      const value1 = results1Dict[key] || 0;
      const value2 = results2Dict[key] || 0;
      const difference = value1 - value2;

      if (difference !== 0) {
        comparison.push({
          [collection1GroupField]: key,
          [`${collection1Name}_total`]: value1,
          [`${collection2Name}_total`]: value2,
          difference: difference
        });
      }
    });

    // Print the comparison results
    console.log("Comparison Results:");
    comparison.forEach(item => {
      console.log(JSON.stringify(item, null, 2));
    });
    // Implement your comparison logic here...

  } catch (error) {
    console.error('Error in compareCollections', error);
  }
};

// Run the comparison
compareCollections();
