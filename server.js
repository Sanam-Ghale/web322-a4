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

// Route for "/shop" - return only the published items
app.get('/shop', (req, res) => {
    storeService.getItems()
        .then(items => {
            // Filter items to only include those with published == true
            const publishedItems = items.filter(item => item.published === true);
            res.json(publishedItems);
        })
        .catch(err => {
            res.status(500).send("Unable to retrieve shop items");
        });
});

// Handle 404 errors - non-matching routes
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
