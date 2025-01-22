const lodash = require('lodash');

/**
 * Unions two arrays of MongoDB objects into a single array.
 *
 * @param {Array<Object>} array1 The first array of MongoDB objects.
 * @param {Array<Object>} array2 The second array of MongoDB objects.
 * @returns {Array<Object>} A new array containing all objects from both input arrays.
 * @throws {TypeError} If either input is not an array.
 */
function unionArraysOfObjects(array1, array2) {
    if (!Array.isArray(array1)) {
        throw new TypeError('array1 must be an array.');
    }

    if (!Array.isArray(array2)) {
        throw new TypeError('array2 must be an array.');
    }

    // Use the spread syntax for a concise way to create a new array
    // containing all elements from both input arrays. This creates a SHALLOW copy.
    const unionedArray = [...array1, ...array2];

    return unionedArray;
}


/**
 * Creates a unique array of objects based on a specified object path.
 *
 * @param {Array<Object>} objects The array of objects to process.
 * @param {string} objectPath The path to the property to use for uniqueness (e.g., 'id', 'user.name', '_id').
 * @returns {Array<Object>} A new array containing only unique objects. Returns empty array if input is not valid.
 * @throws {TypeError} If objects is not an array or objectPath is not a string.
 */
function uniqueObjectsByPath(objects, objectPath) {
    if (!Array.isArray(objects)) {
        console.error("objects must be an array.");
        return []; // or throw new TypeError('objects must be an array.'); if you prefer throwing error.
    }

    if (typeof objectPath !== 'string') {
        console.error("objectPath must be a string.");
        return []; // or throw new TypeError('objectPath must be a string.');
    }

    const uniqueValues = new Set();
    const uniqueObjects = [];

    for (const obj of objects) {
        // Use lodash.get for robust path traversal (handles nested paths and undefined values):
        const value = lodash.get(obj, objectPath);

        if (value !== undefined && !uniqueValues.has(value)) {
            uniqueValues.add(value);
            uniqueObjects.push(obj);
        }
    }

    return uniqueObjects;
}

// // Example call:
// const uniqueById = uniqueObjectsByPath(objects, 'id');
// const uniqueByUserName = uniqueObjectsByPath(objects, 'user.name');


/**
 * Creates a common array of objects based on a specified object path from two input arrays.
 *
 * @param {Array<Object>} array1 The first array of objects.
 * @param {Array<Object>} array2 The second array of objects.
 * @param {string} objectPath The path to the property to use for comparison (e.g., 'id', 'user.name', '_id').
 * @returns {Array<Object>} A new array containing only the objects that exist in both input arrays based on the object path. Returns empty array if input is not valid.
 * @throws {TypeError} If array1 or array2 is not an array or objectPath is not a string.
 */
function commonObjectsByPath(array1, array2, objectPath, isObjTakeFromFirstArr = true) {
    if (!Array.isArray(array1) || !Array.isArray(array2) || typeof objectPath !== 'string') {
        console.error("Invalid input: array1 and array2 must be arrays, and objectPath must be a string.");
        return [];
    }

    // Create a set of unique values based on the object path from the second array:
    const uniqueValuesInArray1 = new Set();
    const uniqueValuesCommon = new Set();
    const commonObjects = [];

    for (const obj of array1) {
        // Use lodash.get for robust path traversal (handles nested paths and undefined values):
        const value = lodash.get(obj, objectPath);

        if (value !== undefined && !uniqueValuesInArray1.has(value)) {
            uniqueValuesInArray1.add(value);
        }
    }

    for (const obj of array2) {
        // Use lodash.get for robust path traversal (handles nested paths and undefined values):
        const value = lodash.get(obj, objectPath);

        if (value !== undefined && uniqueValuesInArray1.has(value)) {
            uniqueValuesCommon.add(value);
        }
    }

    const objFromArr = isObjTakeFromFirstArr ? array1 : array2;

    for (const obj of objFromArr) {
        // Use lodash.get for robust path traversal (handles nested paths and undefined values):
        const value = lodash.get(obj, objectPath);

        if (value !== undefined && uniqueValuesCommon.has(value)) {
            uniqueValuesCommon.delete(value);
            commonObjects.push(obj);
        }
    }

    return commonObjects;
}

// // Example call:
// const commonById = commonObjectsByPath(arrOfObj1, arrOfObj2, 'id', false);
// console.log("Common by id:", commonById);

// const commonByUserName = commonObjectsByPath(arrOfObj1, arrOfObj2, 'user.name');
// console.log("Common by user.name:", commonByUserName);


module.exports = { unionArraysOfObjects, uniqueObjectsByPath, commonObjectsByPath };