const express = require('express');
const userController = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/auth');
const { validateSignUp, validateLogin } = require('../middleware/validator');


const router = express.Router();

// GET /user/new: send HTML form for user signup
router.get('/new', isGuest, userController.new);

// POST /user/new: handle user signup
// router.post('/', isGuest, userController.create);
router.post('/', isGuest, validateSignUp, userController.create);


//GET /users/login: send html for logging in
router.get('/login', isGuest, userController.getUserLogin);

//POST /users/login: authenticate user's login
// router.post( '/login', isGuest, userController.login);
router.post('/login', isGuest, validateLogin, userController.login);


//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, userController.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, userController.logout);

module.exports = router;