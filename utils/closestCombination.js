// Purpose: Find the subset of objects in an array whose specified numeric field (e.g., "value")
// sums closest to a target (e.g., 100,000), optimizing for memory and performance.
function findClosestCombination(items, target, field = 'value') {
    if (items.length === 0) return { sum: 0, combination: [], difference: target };

    // Sort items by the specified field in descending order
    const sortedItems = items
        .map((item, index) => ({ ...item, index }))
        .sort((a, b) => b[field] - a[field]);

    const totalSum = sortedItems.reduce((acc, item) => acc + item[field], 0);
    let remainingTotal = totalSum;

    const dp = new Map(); // Key: sum, Value: indices array
    dp.set(0, []);

    let closestSum = 0;
    let closestDiff = Math.abs(target - closestSum);
    let closestIndices = [];

    for (const item of sortedItems) {
        const currentValue = item[field];
        remainingTotal -= currentValue;

        const temp = new Map();

        // Iterate through existing sums to generate new sums
        for (const [sum, indices] of dp) {
            const newSum = sum + currentValue;
            const newIndices = [...indices, item.index];

            // Check if this new sum can improve the closest difference
            const maxPossible = newSum + remainingTotal;
            const minPossible = newSum;
            let bestPossibleDiff;

            if (maxPossible < target) {
                bestPossibleDiff = target - maxPossible;
            } else if (minPossible > target) {
                bestPossibleDiff = minPossible - target;
            } else {
                bestPossibleDiff = 0; // Exact match possible
            }

            // Skip if best possible can't surpass current closest
            if (bestPossibleDiff >= closestDiff && closestDiff !== 0) continue;

            // Update closest sum if needed
            const currentDiff = Math.abs(target - newSum);
            if (currentDiff < closestDiff || (currentDiff === closestDiff && newSum > closestSum)) {
                closestSum = newSum;
                closestDiff = currentDiff;
                closestIndices = newIndices;
            }

            // Keep the shortest indices array for memory efficiency
            if (!temp.has(newSum) || newIndices.length < temp.get(newSum).length) {
                temp.set(newSum, newIndices);
            }
        }

        // Merge temporary sums into DP map
        for (const [newSum, newIndices] of temp) {
            if (!dp.has(newSum) || newIndices.length < dp.get(newSum).length) {
                dp.set(newSum, newIndices);
            }
        }

        // Prune sums that can't improve the closest difference
        for (const [sum, indices] of dp) {
            const maxPossible = sum + remainingTotal;
            const minPossible = sum;
            let bestPossibleDiff;

            if (maxPossible < target) {
                bestPossibleDiff = target - maxPossible;
            } else if (minPossible > target) {
                bestPossibleDiff = minPossible - target;
            } else {
                bestPossibleDiff = 0;
            }

            if (bestPossibleDiff >= closestDiff && closestDiff !== 0) {
                dp.delete(sum);
            }
        }

        // Early exit if exact match found
        if (closestDiff === 0) break;
    }

    // Fallback if no valid combinations (use the largest single item)
    if (closestIndices.length === 0 && items.length > 0) {
        closestSum = sortedItems[0][field];
        closestIndices = [sortedItems[0].index];
        closestDiff = Math.abs(target - closestSum);
    }

    // Map indices back to original items
    const combination = closestIndices.map(index => items[index]);

    return {
        sum: closestSum,
        combination: combination,
        difference: closestDiff
    };
}

// // Example usage
// const itemsWithAmount = [
//     { amount: 20000 },
//     { amount: 80000 },
//     { amount: 25000 }
// ];
// const targetAmount = 100000;

// const result = findClosestCombination(itemsWithAmount, targetAmount, 'amount');
// console.log(`Closest sum: ${result.sum}`); // Output: 100000
// console.log(`Combination:`, result.combination.map(item => item.amount)); // [20000, 80000]
// console.log(`Difference: ${result.difference}`);

module.exports = { findClosestCombination }; // Make the function available for other modules
