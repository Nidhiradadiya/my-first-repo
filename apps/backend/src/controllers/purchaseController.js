const Purchase = require('../models/purchaseModel');
const RawMaterial = require('../models/rawMaterialModel');

// @desc    Create new purchase
// @route   POST /api/purchase
// @access  Private/Admin
const createPurchase = async (req, res) => {
    const { supplier, invoiceNumber, items, totalAmount } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No items' });
        return;
    }

    const purchase = new Purchase({
        supplier,
        invoiceNumber,
        items,
        totalAmount,
        user: req.user._id,
    });

    const createdPurchase = await purchase.save();

    // Update stock
    for (const item of items) {
        const rawMaterial = await RawMaterial.findById(item.rawMaterial);
        if (rawMaterial) {
            rawMaterial.stock += item.quantity;
            await rawMaterial.save();
        }
    }

    res.status(201).json(createdPurchase);
};

// @desc    Get all purchases
// @route   GET /api/purchase
// @access  Private
const getPurchases = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Purchase.countDocuments({});
    const purchases = await Purchase.find({})
        .populate('user', 'name')
        .populate('items.rawMaterial', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        data: purchases,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

module.exports = { createPurchase, getPurchases };
