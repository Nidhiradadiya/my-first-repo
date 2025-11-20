'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    Factory,
    Package,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    History,
    Zap
} from 'lucide-react';
import Pagination from '@/components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManufacturingPage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
        fetchLogs();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/inventory/finished?limit=1000');
            setProducts(data.data);
            if (data.data.length > 0) setSelectedProduct(data.data[0]._id);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const fetchLogs = async (page = 1) => {
        try {
            const { data } = await api.get(`/manufacturing?page=${page}&limit=10`);
            setLogs(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
        } catch (error) {
            console.error('Failed to fetch logs', error);
        }
    };

    const handleManufacture = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await api.post('/manufacturing', {
                finishedProductId: selectedProduct,
                quantity: Number(quantity),
            });
            setMessage({ type: 'success', text: 'Production started successfully!' });
            fetchLogs(currentPage);
            fetchProducts(); // Update stock
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Production failed. Check raw materials.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 text-white">
                    <Factory size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manufacturing Hub</h1>
                    <p className="text-gray-500">Manage production and track manufacturing history</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Production Control Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="text-yellow-400" size={20} /> Start Production
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Select product and quantity to manufacture</p>
                        </div>

                        <form onSubmit={handleManufacture} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                                <div className="relative">
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none outline-none"
                                    >
                                        {products.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name} (Current Stock: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                    <Package className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Produce</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-20 p-2 text-center bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                            }`}
                                    >
                                        {message.type === 'success' ? <CheckCircle size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading || !selectedProduct}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Initiate Process <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Production History */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <History className="text-gray-400" size={20} /> Recent Activity
                            </h2>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {logs.length} Records
                            </span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {logs.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <Factory size={48} className="mx-auto mb-4 text-gray-200" />
                                    <p>No manufacturing history found.</p>
                                </div>
                            ) : (
                                logs.map((log, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={log._id}
                                        className="p-6 hover:bg-gray-50 transition-colors group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{log.finishedProduct?.name || 'Unknown Product'}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        By: {log.user?.name || 'Admin'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-bold text-gray-900">+{log.quantity}</span>
                                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Completed</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={fetchLogs}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
