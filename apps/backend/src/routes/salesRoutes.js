const express = require('express');
const router = express.Router();
const { createSale, getSales, getCustomerAnalytics } = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSale).get(protect, getSales);
router.route('/analytics/customers').get(protect, getCustomerAnalytics);

module.exports = router;
