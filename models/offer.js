const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: { 
        type: Number, 
        required: [true, "Amount is required"],
        min: [0.01, "Amount must be at least 0.01"]
    },
    status: {
        type: String,
        enum: ["pending", "rejected", "accepted"],
        default: "pending"
    },
    item: { 
        type: Schema.Types.ObjectId, 
        ref: 'Item',
        required: true 
    },
    buyer: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    seller: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    }
}, {timestamps: true});

module.exports = mongoose.model("Offer", offerSchema);