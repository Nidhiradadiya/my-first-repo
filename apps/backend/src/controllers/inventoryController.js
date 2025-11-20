const RawMaterial = require('../models/rawMaterialModel');
const FinishedProduct = require('../models/finishedProductModel');

// @desc    Get all raw materials
// @route   GET /api/inventory/raw
// @access  Private
const getRawMaterials = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await RawMaterial.countDocuments({});
    const rawMaterials = await RawMaterial.find({})
        .skip(skip)
        .limit(limit);

    res.json({
        data: rawMaterials,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

// @desc    Create raw material
// @route   POST /api/inventory/raw
// @access  Private/Admin
const createRawMaterial = async (req, res) => {
    const { name, stock, unit, pricePerUnit, supplier } = req.body;

    const rawMaterial = new RawMaterial({
        name,
        stock,
        unit,
        pricePerUnit,
        supplier,
    });

    const createdRawMaterial = await rawMaterial.save();
    res.status(201).json(createdRawMaterial);
};

// @desc    Update raw material
// @route   PUT /api/inventory/raw/:id
// @access  Private/Admin
const updateRawMaterial = async (req, res) => {
    const { name, stock, unit, pricePerUnit, supplier } = req.body;

    const rawMaterial = await RawMaterial.findById(req.params.id);

    if (rawMaterial) {
        rawMaterial.name = name;
        rawMaterial.stock = stock;
        rawMaterial.unit = unit;
        rawMaterial.pricePerUnit = pricePerUnit;
        rawMaterial.supplier = supplier;

        const updatedRawMaterial = await rawMaterial.save();
        res.json(updatedRawMaterial);
    } else {
        res.status(404).json({ message: 'Raw Material not found' });
    }
};

// @desc    Get all finished products
// @route   GET /api/inventory/finished
// @access  Private
const getFinishedProducts = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await FinishedProduct.countDocuments({});
    const finishedProducts = await FinishedProduct.find({})
        .populate('recipe.rawMaterial', 'name unit')
        .skip(skip)
        .limit(limit);

    res.json({
        data: finishedProducts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
};

// @desc    Create finished product
// @route   POST /api/inventory/finished
// @access  Private/Admin
const createFinishedProduct = async (req, res) => {
    const { name, stock, price, recipe } = req.body;

    const finishedProduct = new FinishedProduct({
        name,
        stock,
        price,
        recipe,
    });

    const createdFinishedProduct = await finishedProduct.save();
    res.status(201).json(createdFinishedProduct);
};

// @desc    Update finished product
// @route   PUT /api/inventory/finished/:id
// @access  Private/Admin
const updateFinishedProduct = async (req, res) => {
    const { name, stock, price, recipe } = req.body;

    const finishedProduct = await FinishedProduct.findById(req.params.id);

    if (finishedProduct) {
        finishedProduct.name = name;
        finishedProduct.stock = stock;
        finishedProduct.price = price;
        finishedProduct.recipe = recipe;

        const updatedFinishedProduct = await finishedProduct.save();
        res.json(updatedFinishedProduct);
    } else {
        res.status(404).json({ message: 'Finished Product not found' });
    }
};

module.exports = {
    getRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    getFinishedProducts,
    createFinishedProduct,
    updateFinishedProduct,
};
