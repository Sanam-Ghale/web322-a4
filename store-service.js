let items = [];
let categories = [
    { id: 1, name: "Home, Garden" },
    { id: 2, name: "Electronics, Computers, Video Games" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Sports & Outdoors" },
    { id: 5, name: "Pets" }
];

// Function to initialize the data
function initialize() {
    return new Promise((resolve, reject) => {
        // In-memory initialization
        resolve();
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
        const categoryItems = items.filter(item => item.category === parseInt(category));
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
    getCategories,
    getNextItemId,
    addItem,
    getItemById,
    getItemsByCategory,
    getItemsByMinDate
};
