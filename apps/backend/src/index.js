const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/purchase', require('./routes/purchaseRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/manufacturing', require('./routes/manufacturingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel (serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;
