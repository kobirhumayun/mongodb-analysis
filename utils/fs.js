const fs = require('fs');
const path = require('path');

/**
 * Converts an array of MongoDB objects to JSON and saves it to a file.
 *
 * @param {Array<Object>} dataArray The array of MongoDB objects to convert.
 * @param {string} filePath The path to the JSON file to create or overwrite.
 * @returns {Promise<void>} A Promise that resolves when the file is saved successfully, or rejects if an error occurs.
 * @throws {TypeError} If dataArray is not an array or filePath is not a string.
 */
async function saveArrayOfObjToJsonFile(dataArray, filePath) {
    if (!Array.isArray(dataArray)) {
        throw new TypeError('dataArray must be an array.');
    }

    if (typeof filePath !== 'string') {
        throw new TypeError('filePath must be a string.');
    }

    try {
        // Convert the array to a JSON string with proper indentation
        const jsonData = JSON.stringify(dataArray, null, 2);

        // Ensure the directory exists. Create it recursively if needed.
        const dir = path.dirname(filePath);
        await fs.promises.mkdir(dir, { recursive: true });

        // Write the JSON string to the file, overwriting if it exists
        await fs.promises.writeFile(filePath, jsonData, 'utf8');
        console.log(`Data saved to ${filePath}`);
    } catch (error) {
        console.error(`Error saving JSON to file: ${error}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}


// Example usage (you would typically get data from MongoDB):
async function exampleUsage() {
    try {
        const sampleData = [
            { _id: 1, name: 'Item 1', value: 10 },
            { _id: 2, name: 'Item 2', value: 20 },
            { _id: 3, name: 'Item 3', value: 30 }
        ];

        const outputFilePath = path.join(__dirname, '..', '..', 'data', 'output.json'); // Use path.join for cross-platform compatibility

        await saveArrayOfObjToJsonFile(sampleData, outputFilePath);

        // Example with invalid input:
        // await saveArrayOfObjToJsonFile("not an array", outputFilePath); // This will throw a TypeError

        const sampleData2 = [
            { id: "6557816a188f6c3116514781", name: 'Item 1', value: 10 },
            { id: "6557816a188f6c3116514782", name: 'Item 2', value: 20 },
            { id: "6557816a188f6c3116514783", name: 'Item 3', value: 30 }
        ];
        const outputFilePath2 = path.join(__dirname, '..', '..', 'data', 'output2.json');
        await saveArrayOfObjToJsonFile(sampleData2, outputFilePath2);

    } catch (error) {
        console.error("Example usage error:", error);
    }
}

// exampleUsage();


module.exports = { saveArrayOfObjToJsonFile }; // Make the function available for other modules