const fs = require('fs');
const path = require('path');

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

// Function to initialize the service
function initialize() {
    return Promise.all([
        readJSONFile(path.join(__dirname, 'data', 'categories.json')).then(data => {
            categories = data;
        }),
        readJSONFile(path.join(__dirname, 'data', 'items.json')).then(data => {
            items = data;
        })
    ]).catch(err => {
        throw new Error("Error reading data files: " + err);
    });
}

// Function to get all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject("No categories found");
        } else {
            resolve(categories);
        }
    });
}

// Function to get all items
function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject("No items found");
        } else {
            resolve(items);
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
            resolve(publishedItems);
        }
    });
}

// Export the functions so that they can be used in server.js
module.exports = {
    initialize,
    getCategories,
    getAllItems,
    getPublishedItems
};
