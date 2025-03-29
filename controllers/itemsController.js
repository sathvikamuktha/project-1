const mongoose = require("mongoose");
const Item = require('../models/items');

// Show all items
exports.getAllItems = async (req, res, next) => {
    try {
        const searchTerm = req.query.search;
        let items = await Item.find();

        if (searchTerm) {
            items = items.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.details.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        items.sort((a, b) => a.price - b.price);
        const message = items.length === 0 ? 'Searched item cannot be found :(' : null;

        res.render('items', { items, message });
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
        const { title, seller, condition, price, details } = req.body;
        const image = req.file ? `/img/${req.file.filename}` : null;

        const newItem = new Item({
            title,
            seller,
            condition,
            price: parseFloat(price),
            details,
            image,
            active: true
        });

        await newItem.save();
        res.redirect('/items');
    } catch (err) {
        if (err.name === 'ValidationError') {
            err.status = 400;
            err.message = 'Validation failed: Please check your input data';
        }
        next(err);
    }
};

// Get an item by ID
exports.getItemById = async (req, res, next) => {
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

        res.render("item", { item });
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

        const item = await Item.findById(itemId);
        if (!item) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }

        const { title, condition, price, seller, details } = req.body;
        item.title = title;
        item.condition = condition;
        item.price = parseFloat(price);
        item.seller = seller;
        item.details = details;

        if (req.file) {
            item.image = '/img/' + req.file.filename;
        }

        await item.save();
        res.redirect('/items');
    } catch (err) {
        if (err.name === 'ValidationError') {
            err.status = 400;
            err.message = 'Validation failed: Please check your input data';
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
