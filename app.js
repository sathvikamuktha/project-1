const express = require('express');
const morgan = require('morgan');

const itemsRoutes = require('./routes/itemsRoutes'); 
const userRoutes = require('./routes/userRoutes'); 

const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');


const app = express();

// configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');


const mongUri = 'mongodb+srv://smuktha:sathvika@cluster0.h70tx.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0';

//connect to database
mongoose.connect('mongodb+srv://smuktha:sathvika@cluster0.h70tx.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> {
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(methodOverride('_method')); 


// session setup
app.use(session({
    secret: 'yehahahahae',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: 'mongodb+srv://smuktha:sathvika@cluster0.h70tx.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0' }),
    cookie: {maxAge: 60*60*1000}
}));

app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

// Render home page
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/items', itemsRoutes);
app.use('/user', userRoutes);


// // Render login page
// app.get('/login', (req, res) => {
//     res.render('login');
// });

// // Render signup page
// app.get('/signup', (req, res) => {
//     res.render('signup');
// });


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
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// })