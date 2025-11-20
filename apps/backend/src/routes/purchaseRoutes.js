const express = require('express');
const router = express.Router();
const { createPurchase, getPurchases } = require('../controllers/purchaseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createPurchase).get(protect, getPurchases);

module.exports = router;
