const express = require('express');
const path = require('path');
const app = express();

// Use static middleware to serve files from the 'public' folder
app.use(express.static('public'));

// Route for "/"
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Route for "/about"
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Set up the server to listen on the environment's PORT or 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
});
