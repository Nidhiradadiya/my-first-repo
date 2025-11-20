const ManufacturingLog = require('../models/manufacturingLogModel');
const FinishedProduct = require('../models/finishedProductModel');
const RawMaterial = require('../models/rawMaterialModel');

// @desc    Manufacture product
// @route   POST /api/manufacturing
// @access  Private/Admin
const manufactureProduct = async (req, res) => {
    const { finishedProductId, quantity } = req.body;

    const finishedProduct = await FinishedProduct.findById(finishedProductId).populate('recipe.rawMaterial');

    if (!finishedProduct) {
        res.status(404).json({ message: 'Finished Product not found' });
        return;
    }

    // Check if enough raw materials
    for (const item of finishedProduct.recipe) {
        const requiredQty = item.quantity * quantity;
        if (item.rawMaterial.stock < requiredQty) {
            res.status(400).json({
                message: `Not enough stock for raw material: ${item.rawMaterial.name}. Required: ${requiredQty}, Available: ${item.rawMaterial.stock}`,
            });
            return;
        }
    }

    // Deduct raw materials
    for (const item of finishedProduct.recipe) {
        const rawMaterial = await RawMaterial.findById(item.rawMaterial._id);
        rawMaterial.stock -= item.quantity * quantity;
        await rawMaterial.save();
    }

    // Increase finished product stock
    finishedProduct.stock += Number(quantity);
    await finishedProduct.save();

    // Create Log
    const log = new ManufacturingLog({
        finishedProduct: finishedProductId,
        quantity,
        user: req.user._id,
    });

    const createdLog = await log.save();

    res.status(201).json(createdLog);
};

// @desc    Get manufacturing logs
// @route   GET /api/manufacturing
// @access  Private
const getManufacturingLogs = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ManufacturingLog.countDocuments({});
    const logs = await ManufacturingLog.find({})
        .populate('user', 'name')
        .populate('finishedProduct', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        data: logs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

module.exports = { manufactureProduct, getManufacturingLogs };
