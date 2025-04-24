const User = require('../models/user');
const Item = require('../models/items');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.save()
    .then(user => {
        req.flash('success', 'Account created successfully!');
        req.session.save(() => {
            res.redirect('/user/login');
        });
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'This email address is already in use. Please use a different email.');  
            return res.redirect('/users/new');
        }
        
        console.error('Registration error:', err);
        req.flash('error', 'An error occurred during registration. Please try again using different email.');
        res.redirect('/users/new');
    });
};


exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    //console.log(req);

    let email = req.body.email;
    let password = req.body.password;
    User.findOne({ email: email })

    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');  
            req.session.save(() => {
                res.redirect('/user/login');
            });
        } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.userName = `${user.firstName} ${user.lastName}`;
                    req.flash('success', 'You have successfully logged in');
                    req.session.save(() => {
                        res.redirect('/user/profile');
                    });
                } else {
                    req.flash('error', 'wrong password');
                    req.session.save(() => {
                        res.redirect('/user/login');
                    });
                }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([User.findById(id), Item.find({seller: id})])
    .then(results=>{
        const [user, items] = results;
        res.render('./user/profile', {user, items});
    })
    .catch(err=>next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };