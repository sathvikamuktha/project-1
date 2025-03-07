const express = require('express');
const app = express();
const methodOverride = require('method-override');
const items = require('./models/items');
const itemsRoutes = require('./routes/itemsRoutes'); 

// configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method')); 
app.use('/items', itemsRoutes);

// Render home page
app.get('/', (req, res) => {
    res.render('index');
});

// Render login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Render signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});


//error stuff
app.use((req, res, next) =>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});