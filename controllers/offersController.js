const mongoose = require("mongoose");
const Offer = require('../models/offer');
const Item = require('../models/items');

// Make an offer on an item
exports.makeOffer = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const userId = req.session.user;
        const amount = parseFloat(req.body.amount);

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            const err = new Error("Invalid item ID format");
            err.status = 400;
            return next(err);
        }

        const item = await Item.findById(itemId).populate('seller');
        if (!item) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }

        if (!userId) {
            req.flash('error', 'Please login to make an offer');
            return res.redirect('/user/login');
        }

        if (item.seller._id.toString() === userId.toString()) {
            const err = new Error("You cannot make an offer on your own item");
            err.status = 401;
            return next(err);
        }

        const newOffer = new Offer({
            amount: amount,
            item: itemId,
            buyer: userId,
            seller: item.seller._id
        });

        await newOffer.save();

        item.totalOffers += 1;
        if (amount > item.highestOffer) {
            item.highestOffer = amount;
        }
        await item.save();

        req.flash('success', 'Offer made successfully!');
        res.redirect(`/items/${itemId}`);
    } catch (err) {
        next(err);
    }
};


// View all offers for an item
exports.viewOffers = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const userId = req.session.user;

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

        if (item.seller.toString() !== userId.toString()) {
            const err = new Error("Unauthorized to view these offers");
            err.status = 401;
            return next(err);
        }

        const offers = await Offer.find({ item: itemId })
            .populate('buyer')
            .sort({ amount: -1 });

        res.render('offers', { 
            offers, 
            item,
            isActive: item.active 
        });
    } catch (err) {
        next(err);
    }
};

// Accept an offer
exports.acceptOffer = async (req, res, next) => {
    try {
        const offerId = req.params.offerId;
        const userId = req.session.user;

        if (!mongoose.Types.ObjectId.isValid(offerId)) {
            const err = new Error("Invalid offer ID format");
            err.status = 400;
            return next(err);
        }

        const offer = await Offer.findById(offerId).populate('item');
        if (!offer) {
            const err = new Error("Offer not found");
            err.status = 404;
            return next(err);
        }

        if (offer.seller.toString() !== userId.toString()) {
            const err = new Error("Unauthorized to accept this offer");
            err.status = 401;
            return next(err);
        }

        const item = await Item.findByIdAndUpdate(offer.item._id, { active: false });

        await Offer.findByIdAndUpdate(offerId, { status: 'accepted' });

        await Offer.updateMany(
            { item: offer.item._id, _id: { $ne: offerId } },
            { status: 'rejected' }
        );

        req.flash('success', 'Offer accepted successfully!');
        res.redirect(`/items/${offer.item._id}/offers`);
    } catch (err) {
        next(err);
    }
};