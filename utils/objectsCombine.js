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

module.exports = { unionArraysOfObjects };