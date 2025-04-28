const express = require('express');
const itemsController = require('../controllers/itemsController');
const { isLoggedIn, isAuthor } = require('../middleware/auth');
const { fileUpload } = require('../middleware/fileUpload');

const router = express.Router();


router.get('/', itemsController.search); //get all items

// router.get('/new', itemsController.showNewItemForm); // Form to create an item
router.get('/new', isLoggedIn, itemsController.showNewItemForm); // Form to create an item

// router.post('/', fileUpload, itemsController.createNewItem); // Create new item
router.post('/', fileUpload, isLoggedIn, itemsController.createNewItem); // Create new item

router.get('/:id', itemsController.getItemById); // Get item details

router.get('/:id/edit', fileUpload, isLoggedIn, isAuthor, itemsController.showEditForm); // Form to edit an item

router.put('/:id', fileUpload, isLoggedIn, isAuthor, itemsController.updateItem); // Update an item

router.delete('/:id', fileUpload, isLoggedIn, isAuthor, itemsController.deleteItem); // Delete an item

module.exports = router;