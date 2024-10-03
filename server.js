/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Netra Rana Magar
Student ID: 117314237
Date: 03/10/2024
Cyclic Web App URL: _______________________________________________________
GitHub Repository URL: https://github.com/nrm7007/web322-app.git

********************************************************************************/ 

const express = require('express');
const path = require('path');
const storeService = require('./store-service'); // Require the store-service module

const app = express();

// Use static middleware to serve static files from the public folder
app.use(express.static('public'));

// Initialize the store service
storeService.initialize()
    .then(() => {
        console.log("Store service initialized successfully.");
        
        // Start the server on the specified port or 8080
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Express HTTP server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize store service:", err);
        // Optionally, exit the process if initialization fails
        process.exit(1);
    });

// Route for "/"
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Route for "/about"
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route for "/categories"
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(categories => {
            if (categories.length === 0) {
                return res.status(404).json({ message: "No categories found" });
            }
            res.json(categories);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

// Route for "/items"
app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(items => {
            if (items.length === 0) {
                return res.status(404).json({ message: "No items found" });
            }
            res.json(items);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

// Route for "/shop" - return only the published items
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(publishedItems => {
            if (publishedItems.length === 0) {
                return res.status(404).json({ message: "No published items found" });
            }
            res.json(publishedItems);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

// Handle 404 errors - non-matching routes
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
