import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import RawMaterial from './models/rawMaterialModel.js';
import FinishedProduct from './models/finishedProductModel.js';
import Purchase from './models/purchaseModel.js';
import Sale from './models/saleModel.js';
import ManufacturingLog from './models/manufacturingLogModel.js';
import connectDB from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await RawMaterial.deleteMany();
        await FinishedProduct.deleteMany();

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
        });

        console.log('Admin User Created: admin@example.com / password123');

        const rawMaterials = await RawMaterial.insertMany([
            {
                name: 'Keyboard',
                stock: 50,
                unit: 'pcs',
                pricePerUnit: 15,
                supplier: 'Tech Supplies Inc',
            },
            {
                name: 'Mouse',
                stock: 50,
                unit: 'pcs',
                pricePerUnit: 10,
                supplier: 'Tech Supplies Inc',
            },
            {
                name: 'Monitor',
                stock: 30,
                unit: 'pcs',
                pricePerUnit: 100,
                supplier: 'Display Corp',
            },
            {
                name: 'CPU',
                stock: 20,
                unit: 'pcs',
                pricePerUnit: 200,
                supplier: 'Processor Ltd',
            },
            {
                name: 'Printer',
                stock: 10,
                unit: 'pcs',
                pricePerUnit: 150,
                supplier: 'Print Solutions',
            },
        ]);

        console.log('Raw Materials Imported');

        const computerRecipe = [
            { rawMaterial: rawMaterials[0]._id, quantity: 1 }, // Keyboard
            { rawMaterial: rawMaterials[1]._id, quantity: 1 }, // Mouse
            { rawMaterial: rawMaterials[2]._id, quantity: 1 }, // Monitor
            { rawMaterial: rawMaterials[3]._id, quantity: 1 }, // CPU
        ];

        await FinishedProduct.create({
            name: 'Desktop Computer Set',
            stock: 0,
            price: 500,
            recipe: computerRecipe,
        });

        console.log('Finished Product (Desktop Computer Set) Imported');

        // Create Purchases (Past 7 days)
        const purchases = [];
        for (let i = 0; i < 10; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (i % 7)); // Spread over last 7 days
            purchases.push({
                supplier: `Supplier ${String.fromCharCode(65 + i)}`,
                invoiceNumber: `PUR-${1000 + i}`,
                items: [
                    { rawMaterial: rawMaterials[i % rawMaterials.length]._id, quantity: 10 * (i + 1), unitPrice: 100 },
                ],
                totalAmount: 10 * (i + 1) * 100,
                user: adminUser._id,
                createdAt: date,
            });
        }
        await Purchase.insertMany(purchases);
        console.log('Purchases seeded');

        // Create Sales (Past 7 days + Today)
        const sales = [];
        for (let i = 0; i < 20; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (i % 7)); // Spread over last 7 days
            if (i < 5) date.setHours(new Date().getHours()); // Ensure some are "today"

            sales.push({
                customerName: `Customer ${i + 1}`,
                invoiceNumber: `INV-${2000 + i}`,
                items: [
                    { finishedProduct: desktopComputerSet._id, quantity: 1, price: 1200 }, // Used desktopComputerSet._id
                ],
                taxes: 100,
                totalAmount: 1300,
                user: adminUser._id,
                createdAt: date,
            });
        }
        await Sale.insertMany(sales);
        console.log('Sales seeded');

        // Create Manufacturing Logs
        const logs = [];
        for (let i = 0; i < 5; i++) {
            logs.push({
                finishedProduct: desktopComputerSet._id, // Used desktopComputerSet._id
                quantity: 5,
                user: adminUser._id,
                createdAt: new Date(),
            });
        }
        await ManufacturingLog.insertMany(logs);
        console.log('Manufacturing Logs seeded');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
