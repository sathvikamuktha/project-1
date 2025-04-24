const mongoose = require("mongoose");
const Item = require('../models/items');


// Show all items
exports.search = async (req, res, next) => {
    try {
        const searchTerm = req.query.search;
        let query = { active: true };
        
        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, 'i');
            query.$or = [
                { title: { $regex: searchRegex } },
                { details: { $regex: searchRegex } }
            ];
        }

        const items = await Item.find(query).sort({ price: 1 });

        res.render('items', { 
            items, 
            searchTerm: searchTerm || "",
            userName: req.session.userName,
            message: items.length === 0 ? 'Searched item cannot be found :(' : null
        });
    } catch (err) {
        next(err);
    }
};


// Form to add a new item
exports.showNewItemForm = (req, res) => {
    res.render('./sell');
};

// Create a new item
exports.createNewItem = async (req, res, next) => {
    try {
        const conditionMap = {
            'likeNew': 'Like New',
            'good': 'Good',
            'new': 'New',
            'used': 'Used',
            'fair': 'Fair'
        };
        
        const condition = conditionMap[req.body.condition] || req.body.condition;

        const newItem = new Item({
            title: req.body.title,
            seller: req.session.user,
            condition: condition,
            price: parseFloat(req.body.price),
            details: req.body.details,
            image: req.file ? `/img/${req.file.filename}` : null,
            active: true
        });

        await newItem.save();
        req.flash('success', 'Item created successfully!');
        res.redirect('/items');
    } catch (err) {
        const messages = [];
        for (const field in err.errors) {
            messages.push(`${field}: ${err.errors[field].message}`);
        }
        req.flash('error', messages.join(', '));
        res.redirect('/items/new');
    }
};


// Get an item by ID
exports.getItemById = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const userId = req.session.user;


        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            const err = new Error("Invalid item ID format");
            err.status = 400;
            return next(err);
        }

        // const item = await Item.findById(itemId);
        const item = await Item.findById(itemId).populate('seller', 'firstName'); 
        // const item = await Item.findById(itemId).populate('seller');

        if (!item) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }

        const isOwner = userId && item.seller._id.toString() === userId.toString(); 
        item.sellerName = `${item.seller.firstName} ${item.seller.lastName}`; 

        res.render("item", { item, isOwner}); 
    } catch (err) {
        next(err);
    }
};

// Edit form for an item
exports.showEditForm = async (req, res, next) => {
    try {
        const itemId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            const err = new Error("Invalid item ID format");
            err.status = 400;
            return next(err);
        }

        const item = await Item.findById(itemId);
        if (!item) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }

        res.render("edit", { item });
    } catch (err) {
        next(err);
    }
};

// Update an item 
exports.updateItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            const err = new Error("Invalid item ID format");
            err.status = 400;
            return next(err);
        }

        const updates = {
            title: req.body.title,
            condition: req.body.condition,
            price: parseFloat(req.body.price),
            details: req.body.details
        };

        if (req.file) {
            updates.image = '/img/' + req.file.filename;
        }

        const item = await Item.findByIdAndUpdate(
            itemId,
            updates,
            { new: true, runValidators: true }
        );

        if (!item) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }

        req.flash('success', 'Item updated successfully!');
        res.redirect('/items');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = [];
            for (const field in err.errors) {
                messages.push(`${field}: ${err.errors[field].message}`);
            }
            req.flash('error', messages.join(', '));
            return res.redirect(`/items/${req.params.id}/edit`);
        }
        next(err);
    }
};



// Delete an item
exports.deleteItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            const err = new Error("Invalid item ID format");
            err.status = 400;
            return next(err);
        }

        const deletedItem = await Item.findByIdAndDelete(itemId);
        if (!deletedItem) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }

        res.redirect('/items');
    } catch (err) {
        next(err);
    }
};