const express = require('express');
const router = express.Router();
const { manufactureProduct, getManufacturingLogs } = require('../controllers/manufacturingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, manufactureProduct).get(protect, getManufacturingLogs);

module.exports = router;
