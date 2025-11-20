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
    Activity
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
    Cell
} from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) return <div className="text-center p-10">Failed to load dashboard data.</div>;

    // Mock data for charts (since we don't have historical data in the simple API yet)
    const salesData = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ];

    const stockData = [
        { name: 'Raw Materials', value: stats.totalRawMaterialStock },
        { name: 'Finished Goods', value: stats.totalFinishedProductStock },
    ];

    const COLORS = ['#3b82f6', '#8b5cf6'];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                >
                    <Link href="/sales" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1">
                        <Plus size={20} /> New Bill
                    </Link>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Sales"
                    value={`$${stats.totalSalesAmount.toFixed(2)}`}
                    icon={TrendingUp}
                    color="from-green-500 to-emerald-500"
                    delay={0.1}
                />
                <StatCard
                    title="Today's Purchases"
                    value={`$${stats.totalPurchaseAmount.toFixed(2)}`}
                    icon={TrendingDown}
                    color="from-orange-500 to-red-500"
                    delay={0.2}
                />
                <StatCard
                    title="Raw Material Stock"
                    value={stats.totalRawMaterialStock}
                    icon={Package}
                    color="from-blue-500 to-cyan-500"
                    delay={0.3}
                />
                <StatCard
                    title="Finished Goods"
                    value={stats.totalFinishedProductStock}
                    icon={ShoppingCart}
                    color="from-purple-500 to-pink-500"
                    delay={0.4}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Activity className="text-blue-500" /> Weekly Sales Overview
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Stock Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Stock Distribution</h2>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stockData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stockData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800">{stats.totalRawMaterialStock + stats.totalFinishedProductStock}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Total Items</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {stockData.map((item, index) => (
                            <div key={item.name} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales / Today's Bills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Today's Bills</h2>
                        <Link href="/sales" className="text-blue-600 text-sm hover:underline flex items-center gap-1 font-medium">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="p-4">Invoice #</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.todaysSales && stats.todaysSales.length > 0 ? (
                                    stats.todaysSales.map((sale) => (
                                        <tr key={sale._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{sale.invoiceNumber}</td>
                                            <td className="p-4 text-gray-600">{sale.customerName}</td>
                                            <td className="p-4 font-bold text-gray-900">${sale.totalAmount.toFixed(2)}</td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Paid</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            No sales recorded today.
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
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={24} /> Low Stock Alerts
                        </h2>
                    </div>
                    <div className="p-4 space-y-3">
                        {stats.lowStockRawMaterials.length === 0 && stats.lowStockFinishedProducts.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                                <Package size={48} className="text-green-200 mb-2" />
                                <p>All stock levels are healthy.</p>
                            </div>
                        ) : (
                            <>
                                {stats.lowStockRawMaterials.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center p-4 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <div>
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-red-500 font-medium">Raw Material</p>
                                            </div>
                                        </div>
                                        <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100 shadow-sm">
                                            {item.stock} left
                                        </span>
                                    </div>
                                ))}
                                {stats.lowStockFinishedProducts.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center p-4 bg-orange-50/50 rounded-xl border border-orange-100 hover:bg-orange-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            <div>
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-orange-500 font-medium">Finished Product</p>
                                            </div>
                                        </div>
                                        <span className="bg-white text-orange-600 text-xs font-bold px-3 py-1 rounded-full border border-orange-100 shadow-sm">
                                            {item.stock} left
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md hover:border-blue-200 group"
        >
            <div className={`bg-gradient-to-br ${color} p-4 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </motion.div>
    );
}
