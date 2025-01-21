function filterObjectsByPathValue(objects, paths, comparisonValue, comparisonType = "equal") {
    if (!Array.isArray(objects)) {
        throw new Error("Objects must be an array.");
    }

    if (!Array.isArray(paths)) {
        throw new Error("Paths must be an array.");
    }

    if (paths.length === 0) {
        return []; // Return empty array if no paths are provided
    }

    const matchingObjects = [];

    for (const obj of objects) {
        for (const path of paths) {
            const valueAtPath = getNestedValue(obj, path);

            if (compareValues(valueAtPath, comparisonValue, comparisonType)) {
                matchingObjects.push(obj);
                break; // Once a match is found for an object, move to the next object
            }
        }
    }

    return matchingObjects;
}

function getNestedValue(obj, path) {
    try {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    } catch (error) {
        return undefined; // Handle cases where the path doesn't exist
    }
}

function compareValues(value1, value2, comparisonType) {
    switch (comparisonType) {
        case "equal":
            return value1 === value2;
        case "notEqual":
            return value1 !== value2;
        case "greaterThan":
            return value1 > value2;
        case "greaterThanOrEqual":
            return value1 >= value2;
        case "lessThan":
            return value1 < value2;
        case "lessThanOrEqual":
            return value1 <= value2;
        default:
            console.warn(`Invalid comparison type: ${comparisonType}. Defaulting to "equal".`);
            return value1 === value2;
    }
}

// // Example usage:
// const data = [
//     { name: "Alice", age: 25, value: 10 },
//     { name: "Bob", age: 30, value: 20 },
//     { name: "Charlie", age: 20, value: 15 },
//     { name: "David", age: 35, value: 5 },
//     { name: "Eve", value: 25 }
// ];

// const pathsAge = ["age"];
// const pathsValue = ["value"];

// console.log("Equal to 30:", filterObjectsByPathValue(data, pathsAge, 30));
// console.log("Greater than 25:", filterObjectsByPathValue(data, pathsAge, 25, "greaterThan"));
// console.log("Less than or equal to 25:", filterObjectsByPathValue(data, pathsAge, 25, "lessThanOrEqual"));
// console.log("Not equal to 20:", filterObjectsByPathValue(data, pathsAge, 20, "notEqual"));
// console.log("Value greater than 10:", filterObjectsByPathValue(data, pathsValue, 10, "greaterThan"));
// console.log("Value less than 10:", filterObjectsByPathValue(data, pathsValue, 10, "lessThan"));
// console.log("Invalid comparison type:", filterObjectsByPathValue(data, pathsAge, 30, "invalid"));

// // Example with non-existent path and comparison
// const pathsNonExistent = ["non.existent.path"];
// console.log("Non-existent path comparison:", filterObjectsByPathValue(data, pathsNonExistent, undefined, "equal"));

// const pathsNonExistentGreaterThan = ["non.existent.path"];
// console.log("Non-existent path greater than comparison:", filterObjectsByPathValue(data, pathsNonExistentGreaterThan, 10, "greaterThan"));

// const pathsNonExistentLessThan = ["non.existent.path"];
// console.log("Non-existent path less than comparison:", filterObjectsByPathValue(data, pathsNonExistentLessThan, 10, "lessThan"));

module.exports = { filterObjectsByPathValue};
