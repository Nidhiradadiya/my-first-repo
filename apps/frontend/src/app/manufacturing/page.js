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
    Zap,
    Loader2
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
        <div className="max-w-7xl mx-auto space-y-8 p-6 bg-stone-50 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <div className="p-3 bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl shadow-lg shadow-amber-900/20 text-white">
                    <Factory size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-light text-amber-950 tracking-tight">Manufacturing Hub</h1>
                    <p className="text-stone-500 font-light">Manage production and track manufacturing history</p>
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
                    <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden sticky top-24">
                        <div className="p-6 bg-amber-950 text-amber-50 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-950 opacity-50"></div>
                            <div className="relative z-10">
                                <h2 className="text-xl font-serif font-medium flex items-center gap-2">
                                    <Zap className="text-amber-300" size={20} /> Start Production
                                </h2>
                                <p className="text-amber-200/60 text-sm mt-1 font-light">Select product and quantity to manufacture</p>
                            </div>
                        </div>

                        <form onSubmit={handleManufacture} className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Select Product</label>
                                <div className="relative group">
                                    <select
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        className="w-full p-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all appearance-none font-light text-amber-950"
                                    >
                                        {products.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name} (Current Stock: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                    <Package className="absolute left-3 top-3.5 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Quantity to Produce</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-20 p-2 text-center bg-stone-50 border border-stone-200 rounded-xl font-medium text-amber-950 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all"
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-xl flex items-start gap-3 text-sm font-light ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                            }`}
                                    >
                                        {message.type === 'success' ? <CheckCircle size={18} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading || !selectedProduct}
                                className="w-full py-4 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-light text-lg shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
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
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/30">
                            <h2 className="text-xl font-serif font-medium text-amber-950 flex items-center gap-2">
                                <History className="text-stone-400" size={20} /> Recent Activity
                            </h2>
                            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                                {logs.length} Records
                            </span>
                        </div>

                        <div className="divide-y divide-stone-100">
                            {logs.length === 0 ? (
                                <div className="p-12 text-center text-stone-400">
                                    <Factory size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-light">No manufacturing history found.</p>
                                </div>
                            ) : (
                                logs.map((log, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={log._id}
                                        className="p-6 hover:bg-amber-50/30 transition-colors group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-100">
                                                <Package size={24} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-amber-950 font-serif">{log.finishedProduct?.name || 'Unknown Product'}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-stone-500 font-light">
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
                                            <span className="block text-2xl font-light text-amber-900">+{log.quantity}</span>
                                            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">Completed</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-stone-100">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={fetchLogs}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
