const mongoose = require('mongoose');

const finishedProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
        },
        recipe: [
            {
                rawMaterial: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'RawMaterial',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const FinishedProduct = mongoose.model('FinishedProduct', finishedProductSchema);

module.exports = FinishedProduct;
