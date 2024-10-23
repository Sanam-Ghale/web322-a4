/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Netra Rana Magar
Student ID: 117314237
Date: 23/10/2024
Cyclic Web App URL: https://web322-app-ashy.vercel.app/
GitHub Repository URL: https://github.com/nrm7007/web322-app.git

********************************************************************************/ 

const express = require('express');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const storeService = require('./store-service');
const app = express();
const upload = multer(); // For parsing multipart/form-data

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

// Route to redirect from "/" to "/about"
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Route to serve the "about.html" file
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Route to get all published items
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(data => res.json(data))
        .catch(err => {
            console.error("Error in /shop route:", err);
            res.status(500).json({ message: err });
        });
});

// Route to get all items with optional filters
app.get('/items', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(data => res.json(data))
            .catch(err => {
                console.error("Error in /items route with category filter:", err);
                res.status(500).json({ message: err });
            });
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(data => res.json(data))
            .catch(err => {
                console.error("Error in /items route with minDate filter:", err);
                res.status(500).json({ message: err });
            });
    } else {
        storeService.getAllItems()
            .then(data => res.json(data))
            .catch(err => {
                console.error("Error in /items route:", err);
                res.status(500).json({ message: err });
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
        .then(data => res.json(data))
        .catch(err => {
            console.error("Error in /categories route:", err);
            res.status(500).json({ message: err });
        });
});

// New route to serve the addItem.html file
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
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
    res.status(404).send("Page Not Found");
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

module.exports = app; 
