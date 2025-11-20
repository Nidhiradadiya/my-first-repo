const RawMaterial = require('../models/rawMaterialModel');
const FinishedProduct = require('../models/finishedProductModel');
const Purchase = require('../models/purchaseModel');
const Sale = require('../models/saleModel');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    const rawMaterials = await RawMaterial.find({});
    const finishedProducts = await FinishedProduct.find({});

    const totalRawMaterialStock = rawMaterials.reduce((acc, item) => acc + item.stock, 0);
    const totalFinishedProductStock = finishedProducts.reduce((acc, item) => acc + item.stock, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysPurchases = await Purchase.find({
        createdAt: { $gte: today },
    });

    const todaysSales = await Sale.find({
        createdAt: { $gte: today },
    });

    const totalPurchaseAmount = todaysPurchases.reduce((acc, item) => acc + item.totalAmount, 0);
    const totalSalesAmount = todaysSales.reduce((acc, item) => acc + item.totalAmount, 0);

    const lowStockRawMaterials = rawMaterials.filter((item) => item.stock < 10);
    const lowStockFinishedProducts = finishedProducts.filter((item) => item.stock < 5);

    res.json({
        totalRawMaterialStock,
        totalFinishedProductStock,
        totalPurchaseAmount,
        totalSalesAmount,
        lowStockRawMaterials,
        lowStockFinishedProducts,
        todaysSales,
    });
};

module.exports = { getDashboardStats };
