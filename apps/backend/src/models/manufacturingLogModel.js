const mongoose = require('mongoose');

const manufacturingLogSchema = mongoose.Schema(
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

const ManufacturingLog = mongoose.model('ManufacturingLog', manufacturingLogSchema);

module.exports = ManufacturingLog;
