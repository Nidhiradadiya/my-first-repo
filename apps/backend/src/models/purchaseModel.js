const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema(
    {
        supplier: {
            type: String,
            required: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
        },
        items: [
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
                unitPrice: {
                    type: Number,
                    required: true,
                },
            },
        ],
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

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
