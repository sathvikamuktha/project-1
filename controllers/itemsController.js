const items = require('../models/items');
const { v4: uuidv4 } = require('uuid');

exports.getAllItems = (req, res) => {
    const searchTerm = req.query.search;
    let sortedItems = items.sort((a, b) => a.price - b.price);
    if (searchTerm) {
        sortedItems = sortedItems.filter(item => {
            return (
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.details.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    } 
    const message = sortedItems.length === 0 ? 'Searched item can not be found :(' : null;
    res.render('items', { items: sortedItems, message: message });
};


//form to add a new item
exports.showNewItemForm = (req, res) => {
   res.render('./sell');
};


exports.createNewItem = (req, res) => {
    const { title, seller, condition, price, details } = req.body;
 
    const newItem = {
        id: uuidv4(), 
        title: title || "No Title",
        seller: seller || "Unknown Seller",
        condition: condition || "Unknown Condition",
        price: price ? parseFloat(price) : 0.00,
        details: details || "No details provided",
        active: true 
    };
    if (req.file) {
        newItem.image = ('/img/' + req.file.filename);
    }
    console.log(newItem);

    items.push(newItem);
    res.redirect('/items');
 };

// Get an item by ID
exports.getItemById = (req, res, next) => {
   const itemId = req.params.id;
   const item = items.find(i => i.id === itemId);
   if (item) {
       res.render('item', { item });
   } else {
        const error = new Error(`Cannot find an item with id '${itemId}'`);
        error.status = 404;
        next(error);
   }
};


//edit form for an item
exports.showEditForm = (req, res, next) => {
    const itemId = req.params.id;
   const item = items.find(i => i.id === itemId);
   if (item) {
        res.render('edit', { item });
    } else {
       const error = new Error('Item not found');
       error.status = 404;
       next(error);
    }
};

exports.updateItem = (req, res, next) => {
    const itemId = req.params.id;
    const item = items.find(i => i.id === itemId);
    if (item) {
        const { title, condition, price, seller, details } = req.body;
 
        item.title = title;
        item.condition = condition;
        item.price = parseFloat(price);
        item.seller = seller;
        item.details = details;
 
        //image
        if (req.file) {
            item.image = ('/img/' + req.file.filename);
        }
        console.log(item);

        res.redirect('/items');
    } else {
        res.status(404).send("Item not found");
    }
 };


// Delete an item
exports.deleteItem = (req, res, next) => {
   const itemId = req.params.id;
   const itemIndex = items.findIndex(i => i.id === itemId);
   if (itemIndex !== -1) {
       items.splice(itemIndex, 1);
       res.redirect('/items');
   } else {
       let err = new Error("Item not found");
       err.status = 404;
       next(error);
   }
};