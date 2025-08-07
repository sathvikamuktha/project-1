const express = require('express');
const itemsController = require('../controllers/itemsController');
const offersRoutes = require('./offersRoutes');
const { isLoggedIn, isAuthor } = require('../middleware/auth');
const { fileUpload } = require('../middleware/fileUpload');
const { validateId, validateItem, validateResults } = require('../middleware/validator');


const router = express.Router();

router.get('/', itemsController.search); //get all items

// router.get('/new', itemsController.showNewItemForm); // Form to create an item
router.get('/new', isLoggedIn, itemsController.showNewItemForm); // Form to create an item

// router.post('/', fileUpload, itemsController.createNewItem); // Create new item
router.post('/', fileUpload, isLoggedIn, validateItem, validateResults, itemsController.createNewItem); // Create new item

router.get('/:id', validateId, itemsController.getItemById); // Get item details

router.get('/:id/edit', validateId, fileUpload, isLoggedIn, isAuthor, itemsController.showEditForm); // Form to edit an item

router.put('/:id', validateId, fileUpload, isLoggedIn, isAuthor, validateItem, validateResults, itemsController.updateItem); // Update an item

router.delete('/:id', validateId, fileUpload, isLoggedIn, isAuthor, itemsController.deleteItem); // Delete an item

router.use('/', offersRoutes);

module.exports = router;