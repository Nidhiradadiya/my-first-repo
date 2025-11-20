const express = require('express');
const router = express.Router();
const {
    getLandingContent,
    getBlogPosts,
    getAboutContent,
    submitContactForm
} = require('../controllers/contentController');

// Public routes (no authentication required)
router.get('/landing', getLandingContent);
router.get('/blog', getBlogPosts);
router.get('/about', getAboutContent);
router.post('/contact', submitContactForm);

module.exports = router;
