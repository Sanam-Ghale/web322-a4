/*********************************************************************************

WEB322 – Assignment 04
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Sanam Ghale
Student ID: 148755226
Date: 18/11/2024
Cyclic Web App URL: https://web322-app-ashy.vercel.app/
GitHub Repository URL: https://github.com/Sanam-Ghale/web322-a4.git

********************************************************************************/ 

const express = require('express');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');
const storeService = require('./store-service');
const app = express();
const upload = multer(); 

const HTTP_PORT = process.env.PORT || 8080;

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dshvshvu7',
    api_key: '274989288126352',
    api_secret: 'NL3-IkUIqJjOPkTv1y3SD40N6tE',
    secure: true
});

// Middleware to serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

// Set Handlebars as the view engine
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return (
                '<li class="nav-item"><a ' +
                (url == app.locals.activeRoute ? ' class="nav-link active" ' : ' class="nav-link" ') + ' href="' +
                url +
                '">' +
                options.fn(this) +
                "</a></li>"
            );
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function (context) {
            return context;
        }
    }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for active route
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

// Route to redirect from "/" to "/shop"
app.get('/', (req, res) => {
    res.redirect('/shop');
});

// Route to serve the "about.hbs" file
app.get('/about', (req, res) => {
    res.render('about');
});

// Route to get all published items
app.get('/shop', async (req, res) => {
    let viewData = {};

    try {
        let items = [];
        if (req.query.category) {
            items = await storeService.getPublishedItemsByCategory(req.query.category);
        } else {
            items = await storeService.getPublishedItems();
        }
        items.sort((a, b) => {
            const dateA = new Date(a.postDate);
            const dateB = new Date(b.postDate);
            if (dateA.getTime() === dateB.getTime()) {
                return b.id - a.id;
            }
            return dateB - dateA;
        });
        let item = items[0];
        viewData.items = items;
        viewData.item = item;
    } catch (err) {
        viewData.message = "no results";
    }

    try {
        let categories = await storeService.getCategories();
        viewData.categories = categories;
    } catch (err) {
        viewData.categoriesMessage = "no results";
    }

    res.render("shop", { data: viewData });
});

// Route to get a specific published item by ID
app.get('/shop/:id', async (req, res) => {
    let viewData = {};

    try {
        let items = [];
        if (req.query.category) {
            items = await storeService.getPublishedItemsByCategory(req.query.category);
        } else {
            items = await storeService.getPublishedItems();
        }
        items.sort((a, b) => {
            const dateA = new Date(a.postDate);
            const dateB = new Date(b.postDate);
            if (dateA.getTime() === dateB.getTime()) {
                return b.id - a.id;
            }
            return dateB - dateA;
        });
        viewData.items = items;
    } catch (err) {
        viewData.message = "no results";
    }

    try {
        viewData.item = await storeService.getItemById(req.params.id);
    } catch (err) {
        viewData.message = "no results";
    }

    try {
        let categories = await storeService.getCategories();
        viewData.categories = categories;
    } catch (err) {
        viewData.categoriesMessage = "no results";
    }

    res.render("shop", { data: viewData });
});

// Route to get all items with optional filters
app.get('/items', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(data => res.render('items', { items: data }))
            .catch(err => {
                console.error("Error in /items route with category filter:", err);
                res.status(500).render('items', { message: "no results" });
            });
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(data => res.render('items', { items: data }))
            .catch(err => {
                console.error("Error in /items route with minDate filter:", err);
                res.status(500).render('items', { message: "no results" });
            });
    } else {
        storeService.getAllItems()
            .then(data => res.render('items', { items: data }))
            .catch(err => {
                console.error("Error in /items route:", err);
                res.status(500).render('items', { message: "no results" });
            });
    }
});

// Route to get an item by ID
app.get('/item/:id', (req, res) => {
    storeService.getItemById(req.params.id)
        .then(data => res.json(data))
        .catch(err => {
            console.error("Error in /item/:id route:", err);
            res.status(500).json({ message: err });
        });
});

// Route to get all categories
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(data => res.render('categories', { categories: data }))
        .catch(err => {
            console.error("Error in /categories route:", err);
            res.status(500).render('categories', { message: "no results" });
        });
});

// New route to serve the addItem.hbs file
app.get('/items/add', (req, res) => {
    res.render('addItem');
});

// Route to handle adding a new item
app.post('/items/add', upload.single('featureImage'), (req, res) => {
    console.log('Received request to add item:', req.body);
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            console.log('Cloudinary upload result:', result);
                            resolve(result);
                        } else {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            try {
                let result = await streamUpload(req);
                return result;
            } catch (error) {
                console.error('Upload error:', error);
                throw error;
            }
        }

        upload(req).then((uploaded) => {
            console.log('Image uploaded to Cloudinary:', uploaded.url);
            processItem(uploaded.url);
        }).catch(err => {
            console.error("Error uploading to Cloudinary:", err);
            res.status(500).json({ message: 'Error uploading image', error: err.message });
        });
    } else {
        processItem("");
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;
        req.body.postDate = new Date().toISOString().split('T')[0];
        console.log('Processing item with imageUrl:', imageUrl);
        // Process the req.body and add it as a new Item before redirecting to /items
        storeService.addItem(req.body)
            .then(() => {
                console.log('Item added successfully');
                res.redirect('/items');
            })
            .catch(err => {
                console.error("Error adding item:", err);
                res.status(500).json({ message: 'Error adding item', error: err.message });
            });
    }
});

// Handle 404 - Page Not Found
app.use((req, res) => {
    res.status(404).render('404');
});

// Initialize the store service and start the server
storeService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => { 
            console.log(`Express http server listening on port ${HTTP_PORT}`); 
        });
    })
    .catch(err => {
        console.error("Unable to start server:", err);
    });

module.exports = app; // Export the app for Vercel
