const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },

    title: { type: String, required: [true, "Title is required"] },
    seller: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },

    condition: { 
        type: String, 
        required: [true, "Condition is required"],
        enum: ["New", "Good", "Used", "Fair", "Bad"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0.01, "Price must be at 0.01"]
    },
    details: { type: String, required: [true, "Details is required"] },
    image: { type: String, required: [true, "Image is required"] },
    active: { type: Boolean, default: true },
    totalOffers: { type: Number, default: 0 },
    highestOffer: { type: Number, default: 0 }

}, {timestamps: true});

module.exports = mongoose.model("Item", itemSchema);