const fs = require('fs');
const path = require('path');

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

// Function to get all categories
function getCategories() {
    return readJSONFile(path.join(__dirname, 'data', 'categories.json'));
}

// Function to get all items
function getItems() {
    return readJSONFile(path.join(__dirname, 'data', 'items.json'));
}

// Export the functions so that they can be used in server.js
module.exports = {
    getCategories,
    getItems
};
