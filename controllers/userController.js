const User = require('../models/user');
const Item = require('../models/items');
const Offer = require('../models/offer');

const validator = require('validator');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = async (req, res, next) => {
    try {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();
        req.flash('success', 'Account created successfully!');
        res.redirect('/user/login');
    } catch (err) {
        if (err.code === 11000) {
            req.flash('error', 'Email already in use');
        } else {
            req.flash('error', 'Error creating account');
        }
        res.redirect('/user/new');
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/user/login');
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/user/login');
        }

        req.session.user = user._id;
        req.session.userName = `${user.firstName} ${user.lastName}`;
        req.flash('success', 'You have successfully logged in');
        res.redirect('/user/profile');
    } catch (err) {
        next(err);
    }
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        req.flash('error', 'Email and password are required');
        return res.redirect('/user/login');
    }

    if (!validator.isEmail(email)) {
        req.flash('error', 'Invalid email format');
        return res.redirect('/user/login');
    }

    User.findOne({ email: email.toLowerCase() })
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password');
            req.session.save(() => res.redirect('/user/login'));
        } else {
            user.comparePassword(password)
            .then(result => {
                if (result) {
                    req.session.user = user._id;
                    req.session.userName = `${user.firstName} ${user.lastName}`;
                    req.flash('success', 'You have successfully logged in');
                    req.session.save(() => res.redirect('/user/profile'));
                } else {
                    req.flash('error', 'Invalid email or password');
                    req.session.save(() => res.redirect('/user/login'));
                }
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([
        User.findById(id), 
        Item.find({seller: id}), 
        Offer.find({buyer: id}).populate('item')
    ])
    .then(results => {
        const [user, items, offers] = results;
        res.render('./user/profile', {user, items, offers});
    })
    .catch(err => {
        console.error('Error in profile:', err);
        next(err);
    });
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };