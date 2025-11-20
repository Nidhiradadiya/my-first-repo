const mongoose = require('mongoose');

const saleSchema = mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        storeName: {
            type: String,
            required: false,
        },
        contactNumber: {
            type: String,
            required: false,
        },
        invoiceNumber: {
            type: String,
            required: true,
        },
        items: [
            {
                finishedProduct: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'FinishedProduct',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        taxes: {
            type: Number,
            required: true,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
