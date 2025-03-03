const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const { fileUpload } = require('../middleware/fileUpload');

router.get('/', itemsController.getAllItems); //get all items
router.get('/new', itemsController.showNewItemForm); // Form to create an item
router.post('/', fileUpload, itemsController.createNewItem); // Create new item
router.get('/:id', itemsController.getItemById); // Get item details
router.get('/:id/edit', itemsController.showEditForm); // Form to edit an item
router.put('/:id', fileUpload, itemsController.updateItem); // Update an item
router.delete('/:id', itemsController.deleteItem); // Delete an item

module.exports = router;
