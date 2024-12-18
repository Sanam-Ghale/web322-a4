const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

// Function to initialize the data
function initialize() {
    return new Promise((resolve, reject) => {
        const itemsPath = path.join(__dirname, 'data/items.json');
        const categoriesPath = path.join(__dirname, 'data/categories.json');
        
        fs.readFile(itemsPath, 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read items.json");
            } else {
                items = JSON.parse(data);
                
                fs.readFile(categoriesPath, 'utf8', (err, data) => {
                    if (err) {
                        reject("Unable to read categories.json");
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

// Function to get all items
function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject('no results returned');
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
            reject('no results returned');
        } else {
            resolve(publishedItems);
        }
    });
}

// Function to get published items by category
function getPublishedItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true && item.category == category);
        if (publishedItems.length === 0) {
            reject('no results returned');
        } else {
            resolve(publishedItems);
        }
    });
}

// Function to get all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject('no results returned');
        } else {
            resolve(categories);
        }
    });
}

// Function to get the next item ID
function getNextItemId() {
    return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Function to add a new item
function addItem(itemData) {
    return new Promise((resolve, reject) => {
        itemData.id = getNextItemId();
        itemData.published = itemData.published !== undefined;
        itemData.postDate = new Date().toISOString().split('T')[0]; // Ensure postDate is set
        items.push(itemData);
        resolve(itemData);
    });
}

// Function to get an item by ID
function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id === parseInt(id));
        if (item) {
            resolve(item);
        } else {
            reject('item not found');
        }
    });
}

// Function to get items by category
function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const categoryItems = items.filter(item => item.category == category);
        if (categoryItems.length) {
            resolve(categoryItems);
        } else {
            reject('no results returned');
        }
    });
}

// Function to get items by min date
function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const dateItems = items.filter(item => new Date(item.postDate) >= minDate);
        if (dateItems.length) {
            resolve(dateItems);
        } else {
            reject('no results returned');
        }
    });
}

module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getPublishedItemsByCategory,
    getCategories,
    getNextItemId,
    addItem,
    getItemById,
    getItemsByCategory,
    getItemsByMinDate
};
