const mongoose = require('mongoose');

const rawMaterialSchema = mongoose.Schema(
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
        unit: {
            type: String,
            required: true, // e.g., kg, liters, pieces
        },
        pricePerUnit: {
            type: Number,
            required: true,
        },
        supplier: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);

module.exports = RawMaterial;
