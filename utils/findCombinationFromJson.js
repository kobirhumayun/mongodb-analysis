const fs = require('fs');
const { findClosestCombination } = require('./closestCombination');

// Read JSON file asynchronously
const readFile = async (filePath) => {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        throw error;
    }
};

const processCombination = (items, target, valueKey) => {
    const result = findClosestCombination(items, target, valueKey);
    console.log(`Closest sum: ${result.sum}`);
    console.log(`Combination:`, result.combination.map(item => item[valueKey]));
    console.log(`Difference: ${result.difference}`);
};

(async () => {
    // find the closest combination of items that sum up to the target value
    const filePath = "C:/Users/Humayun/Downloads/prc_23_24.al_arafah_final_updated.json"; // change the file path as needed
    const target = 10101; // change the target value as needed

    try {
        const items = await readFile(filePath);
        processCombination(items, target, "InvoiceValue");
    } catch (error) {
        console.error("Error processing combination:", error);
    }
})();