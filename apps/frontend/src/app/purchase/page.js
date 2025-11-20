'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Plus, Search, Trash, ShoppingCart, FileText, X, Loader2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function PurchasePage() {
    const [purchases, setPurchases] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        supplier: '',
        invoiceNumber: '',
        items: [],
        totalAmount: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPurchases = async (page = 1) => {
        try {
            const { data } = await api.get(`/purchase?page=${page}&limit=10`);
            setPurchases(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
        } catch (error) {
            console.error('Failed to fetch purchases', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRawMaterials = async () => {
        try {
            const { data } = await api.get('/inventory/raw?limit=1000');
            setRawMaterials(data.data);
        } catch (error) {
            console.error('Failed to fetch raw materials', error);
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchRawMaterials();
    }, []);

    const calculateTotal = (items) => {
        return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/purchase', formData);
            setShowModal(false);
            setFormData({ supplier: '', invoiceNumber: '', items: [], totalAmount: 0 });
            fetchPurchases(currentPage);
        } catch (error) {
            console.error('Failed to create purchase', error);
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { rawMaterial: '', quantity: 1, unitPrice: 0 }],
        });
    };

    const removeItem = (index) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        const total = calculateTotal(newItems);
        setFormData({ ...formData, items: newItems, totalAmount: total });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        const total = calculateTotal(newItems);
        setFormData({ ...formData, items: newItems, totalAmount: total });
    };

    const filteredPurchases = purchases.filter((purchase) =>
        purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-stone-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-light text-amber-950">Purchase Management</h1>
                        <p className="text-stone-500 font-light mt-1">Track and manage supplier invoices</p>
                    </div>
                    <button
                        onClick={() => {
                            setFormData({ supplier: '', invoiceNumber: '', items: [], totalAmount: 0 });
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/20 transition-all hover:scale-105 active:scale-95 font-light"
                    >
                        <Plus size={20} /> New Purchase
                    </button>
                </div>

                <div className="bg-white p-1 rounded-2xl shadow-sm border border-stone-200 mb-8 max-w-md">
                    <div className="relative group">
                        <Search className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by supplier or invoice..."
                            className="w-full pl-12 p-3 bg-transparent border-none rounded-xl focus:outline-none focus:ring-0 font-light text-amber-950 placeholder-stone-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Date</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Invoice #</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Supplier</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Items</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Total Amount</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Created By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-stone-400">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Loading purchases...
                                    </td>
                                </tr>
                            ) : filteredPurchases.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-stone-400">
                                        <ShoppingCart className="mx-auto mb-3 opacity-20" size={48} />
                                        No purchases found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPurchases.map((purchase) => (
                                    <tr key={purchase._id} className="hover:bg-amber-50/30 transition-colors group">
                                        <td className="p-5 text-stone-600 font-light">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                                        <td className="p-5 font-medium text-amber-950">{purchase.invoiceNumber}</td>
                                        <td className="p-5 text-stone-600 font-light">{purchase.supplier}</td>
                                        <td className="p-5">
                                            <ul className="text-sm text-stone-500 font-light space-y-1">
                                                {purchase.items.map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-amber-200 rounded-full"></span>
                                                        {item.rawMaterial?.name} ({item.quantity} @ ${item.unitPrice})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="p-5 font-medium text-emerald-700">${purchase.totalAmount.toFixed(2)}</td>
                                        <td className="p-5 text-stone-500 font-light text-sm">{purchase.user?.name}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchPurchases}
                    />
                </div>

                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 border border-stone-100 custom-scrollbar"
                            >
                                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 sticky top-0 z-20 backdrop-blur-md">
                                    <h2 className="text-xl font-serif font-medium text-amber-950 flex items-center gap-2">
                                        <FileText size={20} className="text-amber-700" /> New Purchase Invoice
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Supplier Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                value={formData.supplier}
                                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                                required
                                                placeholder="Enter supplier name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Invoice Number</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                value={formData.invoiceNumber}
                                                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                                required
                                                placeholder="INV-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-sm font-medium text-amber-900">Items</label>
                                            <button
                                                type="button"
                                                onClick={addItem}
                                                className="text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-100/50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                + Add Item
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.items.map((item, index) => (
                                                <div key={index} className="flex gap-3 items-end bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1 block">Material</label>
                                                        <select
                                                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm font-light text-stone-700"
                                                            value={item.rawMaterial}
                                                            onChange={(e) => updateItem(index, 'rawMaterial', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Material</option>
                                                            {rawMaterials.map((m) => (
                                                                <option key={m._id} value={m._id}>{m.name} ({m.unit})</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="w-24">
                                                        <label className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1 block">Qty</label>
                                                        <input
                                                            type="number"
                                                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm font-light text-stone-700"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="w-28">
                                                        <label className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-1 block">Unit Price</label>
                                                        <input
                                                            type="number"
                                                            className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm font-light text-stone-700"
                                                            value={item.unitPrice}
                                                            onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                                                            required
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mb-0.5"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.items.length === 0 && (
                                                <div className="text-center py-4 text-stone-400 text-sm italic">
                                                    No items added to invoice yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center gap-6 pt-4 border-t border-stone-100">
                                        <div className="text-xl font-serif font-medium text-amber-950">
                                            Total: <span className="text-amber-700">${formData.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-5 py-2.5 bg-amber-900 text-white rounded-xl hover:bg-amber-800 shadow-lg shadow-amber-900/20 transition-all hover:scale-105 active:scale-95 font-medium"
                                            >
                                                Create Invoice
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
