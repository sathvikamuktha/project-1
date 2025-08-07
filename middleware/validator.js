const { body, validationResult } = require('express-validator');
const { isEmail, normalizeEmail, escape, trim } = require('validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid Item id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [
    
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),

    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),

    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateLogin = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];


exports.validateResults = (req, res, next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};


exports.validateItem = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('content', 'Content must be at least 10 characters long').isLength({ min: 10 }).trim().escape()
];