const express = require('express');
const router = express.Router();
const {
    getRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    getFinishedProducts,
    createFinishedProduct,
    updateFinishedProduct,
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/raw').get(protect, getRawMaterials).post(protect, admin, createRawMaterial);
router.route('/raw/:id').put(protect, admin, updateRawMaterial);

router.route('/finished').get(protect, getFinishedProducts).post(protect, admin, createFinishedProduct);
router.route('/finished/:id').put(protect, admin, updateFinishedProduct);

module.exports = router;
