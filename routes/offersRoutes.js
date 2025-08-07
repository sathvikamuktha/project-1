const express = require('express');
const offersController = require('../controllers/offersController');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

// Make an offer on an item
router.post('/:id/offers', isLoggedIn, offersController.makeOffer);

// View all offers for an item
router.get('/:id/offers', isLoggedIn, offersController.viewOffers);

// Accept an offer
router.put('/:id/offers/:offerId/accept', isLoggedIn, offersController.acceptOffer);

module.exports = router;