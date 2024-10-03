const fs = require('fs');
const path = require('path');

// Global arrays to hold items and categories
let items = [];
let categories = [];

// Helper function to read JSON data from a file
function readJSONFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Initialize function to read and parse the items and categories data
function initialize() {
    return readJSONFile(path.join(__dirname, 'data', 'items.json'))
        .then(parsedItems => {
            items = parsedItems; // Assign parsed items to the global array
            return readJSONFile(path.join(__dirname, 'data', 'categories.json'));
        })
        .then(parsedCategories => {
            categories = parsedCategories; // Assign parsed categories to the global array
        })
        .catch(err => {
            return Promise.reject("Unable to read files: " + err); // Reject with error message
        });
}

// Function to get all items
function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject("No results returned for items");
        } else {
            resolve(items); // Resolve with items
        }
    });
}

// Function to get published items
function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length === 0) {
            reject("No published items found");
        } else {
            resolve(publishedItems); // Resolve with published items
        }
    });
}

// Function to get all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject("No results returned for categories");
        } else {
            resolve(categories); // Resolve with categories
        }
    });
}

// Export the functions so they can be used in server.js
module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};
