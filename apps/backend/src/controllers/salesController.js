const Sale = require('../models/saleModel');
const FinishedProduct = require('../models/finishedProductModel');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
    const { customerName, storeName, contactNumber, invoiceNumber, items, taxes, totalAmount } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No items' });
        return;
    }

    // Check stock first
    for (const item of items) {
        const product = await FinishedProduct.findById(item.finishedProduct);
        if (!product) {
            res.status(404).json({ message: `Product not found: ${item.finishedProduct}` });
            return;
        }
        if (product.stock < item.quantity) {
            res.status(400).json({ message: `Not enough stock for ${product.name}` });
            return;
        }
    }

    const sale = new Sale({
        customerName,
        storeName,
        contactNumber,
        invoiceNumber,
        items,
        taxes,
        totalAmount,
        user: req.user._id,
    });

    const createdSale = await sale.save();

    // Update stock
    for (const item of items) {
        const product = await FinishedProduct.findById(item.finishedProduct);
        if (product) {
            product.stock -= item.quantity;
            await product.save();
        }
    }

    res.status(201).json(createdSale);
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Sale.countDocuments({});
    const sales = await Sale.find({})
        .populate('user', 'name')
        .populate('items.finishedProduct', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        data: sales,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

// @desc    Get customer analytics
// @route   GET /api/sales/analytics/customers
// @access  Private
const getCustomerAnalytics = async (req, res) => {
    try {
        const analytics = await Sale.aggregate([
            {
                $group: {
                    _id: {
                        customerName: '$customerName',
                        storeName: '$storeName',
                        contactNumber: '$contactNumber'
                    },
                    totalSales: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                    lastSaleDate: { $max: '$createdAt' }
                }
            },
            {
                $project: {
                    _id: 0,
                    customerName: '$_id.customerName',
                    storeName: '$_id.storeName',
                    contactNumber: '$_id.contactNumber',
                    totalSales: 1,
                    totalAmount: 1,
                    lastSaleDate: 1
                }
            },
            {
                $sort: { totalAmount: -1 }
            }
        ]);

        res.json({ data: analytics });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch customer analytics', error: error.message });
    }
};

module.exports = { createSale, getSales, getCustomerAnalytics };
