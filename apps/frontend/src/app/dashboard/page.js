'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    TrendingUp,
    TrendingDown,
    Package,
    AlertTriangle,
    DollarSign,
    ShoppingCart,
    Plus,
    ArrowRight,
    Activity,
    Users,
    Factory
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';

// Dummy data for when API fails or no data exists
const DUMMY_STATS = {
    totalSalesAmount: 45680.50,
    totalPurchaseAmount: 32450.75,
    totalRawMaterialStock: 1842,
    totalFinishedProductStock: 956,
    todaysSales: [
        {
            _id: '1',
            invoiceNumber: 'INV-2024-001',
            customerName: 'Acme Corporation',
            totalAmount: 5240.00,
            createdAt: new Date('2024-11-20T09:30:00')
        },
        {
            _id: '2',
            invoiceNumber: 'INV-2024-002',
            customerName: 'Global Traders Inc',
            totalAmount: 8950.50,
            createdAt: new Date('2024-11-20T11:15:00')
        },
        {
            _id: '3',
            invoiceNumber: 'INV-2024-003',
            customerName: 'Metro Distribution',
            totalAmount: 3420.75,
            createdAt: new Date('2024-11-20T13:45:00')
        },
        {
            _id: '4',
            invoiceNumber: 'INV-2024-004',
            customerName: 'Prime Solutions Ltd',
            totalAmount: 6890.25,
            createdAt: new Date('2024-11-20T15:20:00')
        }
    ],
    lowStockRawMaterials: [
        { _id: '1', name: 'Steel Sheets', stock: 45 },
        { _id: '2', name: 'Copper Wire', stock: 23 }
    ],
    lowStockFinishedProducts: [
        { _id: '1', name: 'Product A', stock: 12 }
    ]
};

export default function Dashboard() {
    const [stats, setStats] = useState(DUMMY_STATS); // Start with dummy data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats, using dummy data', error);
                // Keep dummy data if API fails
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
            </div>
        );
    }

    // Sales data with more realistic numbers
    const salesData = [
        { name: 'Mon', sales: 12400, purchases: 8200 },
        { name: 'Tue', sales: 15800, purchases: 9500 },
        { name: 'Wed', sales: 11200, purchases: 7800 },
        { name: 'Thu', sales: 18900, purchases: 11200 },
        { name: 'Fri', sales: 22500, purchases: 13400 },
        { name: 'Sat', sales: 19800, purchases: 10900 },
        { name: 'Sun', sales: 16300, purchases: 9200 },
    ];

    const monthlySalesData = [
        { month: 'Jan', amount: 145000 },
        { month: 'Feb', amount: 132000 },
        { month: 'Mar', amount: 168000 },
        { month: 'Apr', amount: 195000 },
        { month: 'May', amount: 210000 },
        { month: 'Jun', amount: 189000 },
    ];

    const stockData = [
        { name: 'Raw Materials', value: stats.totalRawMaterialStock },
        { name: 'Finished Goods', value: stats.totalFinishedProductStock },
    ];

    const COLORS = ['#92400E', '#D97706'];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl font-serif font-light text-amber-950 tracking-tight">Dashboard</h1>
                    <p className="text-amber-800/60 mt-2 font-light">Welcome back, here's your business overview.</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                >
                    <Link href="/sales" className="bg-amber-900 hover:bg-amber-800 text-amber-50 px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all">
                        <Plus size={20} /> New Bill
                    </Link>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Revenue"
                    value={`$${stats.totalSalesAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={TrendingUp}
                    bgColor="bg-emerald-50"
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-700"
                    textColor="text-emerald-900"
                    delay={0.1}
                />
                <StatCard
                    title="Total Purchases"
                    value={`$${stats.totalPurchaseAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={ShoppingCart}
                    bgColor="bg-rose-50"
                    iconBg="bg-rose-100"
                    iconColor="text-rose-700"
                    textColor="text-rose-900"
                    delay={0.2}
                />
                <StatCard
                    title="Raw Materials"
                    value={stats.totalRawMaterialStock.toLocaleString()}
                    icon={Package}
                    bgColor="bg-amber-50"
                    iconBg="bg-amber-100"
                    iconColor="text-amber-700"
                    textColor="text-amber-900"
                    delay={0.3}
                />
                <StatCard
                    title="Finished Products"
                    value={stats.totalFinishedProductStock.toLocaleString()}
                    icon={Factory}
                    bgColor="bg-blue-50"
                    iconBg="bg-blue-100"
                    iconColor="text-blue-700"
                    textColor="text-blue-900"
                    delay={0.4}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Sales vs Purchases */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-stone-50 p-8 rounded-xl border border-stone-200/50"
                >
                    <h2 className="text-2xl font-serif font-light text-amber-950 mb-6 flex items-center gap-2">
                        <Activity className="text-amber-700" size={24} /> Weekly Performance
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#92400E" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#92400E" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontFamily: 'serif' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontFamily: 'serif' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontFamily: 'serif', backgroundColor: '#FFFBEB' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#92400E" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" name="Sales" />
                                <Area type="monotone" dataKey="purchases" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorPurchases)" name="Purchases" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Monthly Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-stone-50 p-8 rounded-xl border border-stone-200/50"
                >
                    <h2 className="text-2xl font-serif font-light text-amber-950 mb-6">Monthly Trend</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlySalesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontFamily: 'serif', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontFamily: 'serif', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontFamily: 'serif', backgroundColor: '#FFFBEB' }}
                                />
                                <Bar dataKey="amount" fill="#92400E" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales / Today's Bills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="lg:col-span-2 bg-stone-50 rounded-xl border border-stone-200/50 overflow-hidden"
                >
                    <div className="p-6 border-b border-stone-200/50 flex justify-between items-center">
                        <h2 className="text-2xl font-serif font-light text-amber-950">Today's Transactions</h2>
                        <Link href="/sales/history" className="text-amber-800 text-sm hover:text-amber-900 flex items-center gap-1 font-light">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-amber-50/30 text-amber-900 text-xs uppercase tracking-wider font-light border-b border-stone-200/50">
                                <tr>
                                    <th className="p-4 font-light">Invoice</th>
                                    <th className="p-4 font-light">Customer</th>
                                    <th className="p-4 font-light">Amount</th>
                                    <th className="p-4 font-light">Time</th>
                                    <th className="p-4 font-light">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200/30">
                                {stats.todaysSales && stats.todaysSales.length > 0 ? (
                                    stats.todaysSales.map((sale) => (
                                        <tr key={sale._id} className="hover:bg-amber-50/20 transition-colors">
                                            <td className="p-4 font-medium text-amber-950">{sale.invoiceNumber}</td>
                                            <td className="p-4 text-stone-700 font-light">{sale.customerName}</td>
                                            <td className="p-4 font-medium text-amber-900">${sale.totalAmount.toFixed(2)}</td>
                                            <td className="p-4 text-stone-600 text-sm font-light">
                                                {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-light">Completed</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-stone-500 font-light">
                                            No transactions recorded today.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Low Stock Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-stone-50 rounded-xl border border-stone-200/50 overflow-hidden"
                >
                    <div className="p-6 border-b border-stone-200/50">
                        <h2 className="text-2xl font-serif font-light text-amber-950 flex items-center gap-2">
                            <AlertTriangle className="text-rose-600" size={24} /> Stock Alerts
                        </h2>
                    </div>
                    <div className="p-4 space-y-3">
                        {stats.lowStockRawMaterials.length === 0 && stats.lowStockFinishedProducts.length === 0 ? (
                            <div className="text-center text-stone-500 py-8 flex flex-col items-center">
                                <Package size={48} className="text-emerald-200 mb-2" />
                                <p className="font-light">All stock levels are healthy.</p>
                            </div>
                        ) : (
                            <>
                                {stats.lowStockRawMaterials.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center p-4 bg-rose-50 rounded-lg border border-rose-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-amber-950">{item.name}</p>
                                                <p className="text-xs text-rose-600 font-light">Raw Material</p>
                                            </div>
                                        </div>
                                        <span className="bg-white text-rose-700 text-xs font-medium px-3 py-1 rounded-full border border-rose-200">
                                            {item.stock} left
                                        </span>
                                    </div>
                                ))}
                                {stats.lowStockFinishedProducts.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-amber-950">{item.name}</p>
                                                <p className="text-xs text-amber-700 font-light">Finished Product</p>
                                            </div>
                                        </div>
                                        <span className="bg-white text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-200">
                                            {item.stock} left
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Additional Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-stone-50 rounded-xl border border-stone-200/50 p-6"
                >
                    <h3 className="text-2xl font-serif font-light text-amber-950 mb-6">Top Products</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Product Alpha', sales: 245, revenue: 12450 },
                            { name: 'Product Beta', sales: 189, revenue: 9870 },
                            { name: 'Product Gamma', sales: 156, revenue: 8230 },
                            { name: 'Product Delta', sales: 142, revenue: 7450 }
                        ].map((product, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-stone-200/30">
                                <div>
                                    <p className="font-medium text-amber-950">{product.name}</p>
                                    <p className="text-xs text-stone-600 font-light">{product.sales} units sold</p>
                                </div>
                                <span className="text-amber-900 font-medium">${product.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="bg-stone-50 rounded-xl border border-stone-200/50 p-6"
                >
                    <h3 className="text-2xl font-serif font-light text-amber-950 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link href="/sales" className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-100 transition-colors group">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="text-emerald-700" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-amber-950">New Sale</p>
                                <p className="text-xs text-stone-600 font-light">Create invoice</p>
                            </div>
                        </Link>

                        <Link href="/purchase" className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors group">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingCart className="text-blue-700" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-amber-950">New Purchase</p>
                                <p className="text-xs text-stone-600 font-light">Record purchase</p>
                            </div>
                        </Link>

                        <Link href="/manufacturing" className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-100 transition-colors group">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Factory className="text-amber-700" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-amber-950">Manufacturing</p>
                                <p className="text-xs text-stone-600 font-light">Log production</p>
                            </div>
                        </Link>

                        <Link href="/inventory/raw" className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-100 transition-colors group">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="text-purple-700" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-amber-950">View Inventory</p>
                                <p className="text-xs text-stone-600 font-light">Check stock</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Performance Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-stone-50 rounded-xl border border-stone-200/50 p-6"
                >
                    <h3 className="text-2xl font-serif font-light text-amber-950 mb-6">Performance</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-stone-200/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-stone-600 font-light">Sales Target</span>
                                <span className="text-sm font-medium text-amber-900">78%</span>
                            </div>
                            <div className="w-full bg-stone-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-stone-200/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-stone-600 font-light">Inventory Turnover</span>
                                <span className="text-sm font-medium text-amber-900">92%</span>
                            </div>
                            <div className="w-full bg-stone-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-stone-200/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-stone-600 font-light">Production Efficiency</span>
                                <span className="text-sm font-medium text-amber-900">85%</span>
                            </div>
                            <div className="w-full bg-stone-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-stone-200/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-stone-600 font-light">Customer Satisfaction</span>
                                <span className="text-sm font-medium text-amber-900">96%</span>
                            </div>
                            <div className="w-full bg-stone-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, bgColor, iconBg, iconColor, textColor, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`${bgColor} p-6 rounded-xl border border-stone-200/50 flex items-center gap-4 transition-all hover:shadow-sm`}
        >
            <div className={`${iconBg} p-4 rounded-lg ${iconColor}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-stone-600 text-sm font-light mb-1">{title}</p>
                <h3 className={`text-2xl font-serif font-light ${textColor}`}>{value}</h3>
            </div>
        </motion.div>
    );
}
