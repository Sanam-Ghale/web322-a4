const express = require('express');
const path = require('path');
const app = express();
const storeService = require('./store-service'); // Require the store-service module

// Use static middleware to serve static files from the public folder
app.use(express.static('public'));

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
            res.json(categories);
        })
        .catch(err => {
            res.status(500).send("Unable to retrieve categories");
        });
});

// Route for "/items"
app.get('/items', (req, res) => {
    storeService.getItems()
        .then(items => {
            res.json(items);
        })
        .catch(err => {
            res.status(500).send("Unable to retrieve items");
        });
});

// Start the server on the specified port or 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
});
