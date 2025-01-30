function findClosestCombination(items, target) {
    const dp = new Map(); // Key: sum, Value: { sum: number, elements: array }
    dp.set(0, { sum: 0, elements: [] });

    let closestSum = null;
    let closestDiff = Infinity;
    let closestElements = [];

    for (const item of items) {
        const currentValue = item.value;
        const temp = new Map();

        for (const [sum, data] of dp) {
            const newSum = sum + currentValue;
            const newElements = [...data.elements, item];

            // Check if this new sum is a candidate for closest
            if (newSum !== 0) { // Skip adding the empty combination here
                const newDiff = Math.abs(target - newSum);
                if (newDiff < closestDiff || (newDiff === closestDiff && newSum > closestSum)) {
                    closestSum = newSum;
                    closestDiff = newDiff;
                    closestElements = newElements;
                }
            }

            if (!temp.has(newSum)) {
                temp.set(newSum, { sum: newSum, elements: newElements });
            }
        }

        // Merge temporary sums into the main DP map
        for (const [sum, data] of temp) {
            if (!dp.has(sum)) {
                dp.set(sum, data);
                // Update closest if this new sum is better
                if (sum !== 0) { // Skip the empty combination
                    const diff = Math.abs(target - sum);
                    if (diff < closestDiff || (diff === closestDiff && sum > closestSum)) {
                        closestSum = sum;
                        closestDiff = diff;
                        closestElements = data.elements;
                    }
                }
            }
        }

        // Early exit if exact match is found
        if (closestDiff === 0) {
            break;
        }
    }

    // Handle the case where the only sum is 0 (empty combination)
    if (closestSum === null && dp.has(0) && items.length > 0) {
        // If all possible sums are 0, which shouldn't happen unless all items have value 0
        // In that case, return the first item's combination (all items summed to 0)
        closestSum = 0;
        closestElements = [items[0]];
        closestDiff = Math.abs(target - closestSum);
        for (const item of items) {
            if (item.value !== 0) {
                closestElements = [item];
                break;
            }
        }
    }

    return {
        sum: closestSum,
        combination: closestElements,
        difference: closestDiff
    };
}

// // Example usage:
// const items = [
//     { value: 50000 },
//     { value: 50000 },
//     { value: 30000 }
// ];
// const target = 100000;

// const result = findClosestCombination(items, target);
// console.log(`Closest sum: ${result.sum}`);
// console.log(`Combination:`, result.combination.map(item => item.value));
// console.log(`Difference: ${result.difference}`);

module.exports = { findClosestCombination }; // Make the function available for other modules
