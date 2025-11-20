'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { FileText, Users, TrendingUp, DollarSign, Phone, Store, Calendar, Filter, User, Loader2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { motion } from 'framer-motion';

export default function SalesHistoryPage() {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('recent'); // recent, mostSales, highValue

    useEffect(() => {
        fetchSales();
        fetchCustomerAnalytics();
    }, [currentPage]);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/sales?page=${currentPage}&limit=10`);
            setSales(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Failed to fetch sales', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerAnalytics = async () => {
        try {
            const { data } = await api.get('/sales/analytics/customers');
            setCustomers(data.data);
        } catch (error) {
            console.error('Failed to fetch customer analytics', error);
        }
    };

    const getSortedCustomers = () => {
        const sorted = [...customers];
        switch (sortBy) {
            case 'recent':
                return sorted.sort((a, b) => new Date(b.lastSaleDate) - new Date(a.lastSaleDate));
            case 'mostSales':
                return sorted.sort((a, b) => b.totalSales - a.totalSales);
            case 'highValue':
                return sorted.sort((a, b) => b.totalAmount - a.totalAmount);
            default:
                return sorted;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-serif font-light text-amber-950">Sales History</h1>
                        <p className="text-stone-500 font-light mt-1">View all sales and customer analytics</p>
                    </div>
                </div>

                {/* Customer Analytics Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="text-amber-700" size={24} />
                            <h2 className="text-xl font-serif font-medium text-amber-950">Customer Analytics</h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${sortBy === 'recent'
                                    ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                Recent
                            </button>
                            <button
                                onClick={() => setSortBy('mostSales')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${sortBy === 'mostSales'
                                    ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                Most Sales
                            </button>
                            <button
                                onClick={() => setSortBy('highValue')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${sortBy === 'highValue'
                                    ? 'bg-amber-900 text-white shadow-lg shadow-amber-900/20'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                High Value
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getSortedCustomers().slice(0, 6).map((customer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gradient-to-br from-stone-50 to-white p-5 rounded-xl border border-stone-200 hover:shadow-lg hover:border-amber-200 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={16} className="text-amber-400 group-hover:text-amber-600 transition-colors" />
                                            <h3 className="font-medium text-amber-950 font-serif">{customer.customerName || 'N/A'}</h3>
                                        </div>
                                        {customer.storeName && (
                                            <div className="flex items-center gap-2 text-sm text-stone-500 font-light">
                                                <Store size={14} className="text-stone-400" />
                                                <span>{customer.storeName}</span>
                                            </div>
                                        )}
                                        {customer.contactNumber && (
                                            <div className="flex items-center gap-2 text-sm text-stone-500 font-light">
                                                <Phone size={14} className="text-stone-400" />
                                                <span>{customer.contactNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-stone-100">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Total Sales</p>
                                        <p className="text-lg font-light text-amber-950">{customer.totalSales}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Total Value</p>
                                        <p className="text-lg font-medium text-emerald-700">${customer.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-stone-100">
                                    <div className="flex items-center gap-2 text-xs text-stone-400 font-light">
                                        <Calendar size={12} />
                                        <span>Last sale: {formatDate(customer.lastSaleDate)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {customers.length === 0 && (
                        <div className="text-center py-12 text-stone-400">
                            <Users size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-light">No customer data available yet.</p>
                        </div>
                    )}
                </div>

                {/* Sales History Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="p-6 border-b border-stone-100 bg-stone-50/30">
                        <div className="flex items-center gap-2">
                            <FileText className="text-amber-700" size={24} />
                            <h2 className="text-xl font-serif font-medium text-amber-950">All Sales</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="animate-spin mx-auto mb-4 text-amber-600" size={32} />
                            <p className="text-stone-500 font-light">Loading sales...</p>
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="p-12 text-center text-stone-400">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-light">No sales found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-stone-50 border-b border-stone-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-amber-900/70 uppercase tracking-wider font-serif">
                                            Invoice
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-amber-900/70 uppercase tracking-wider font-serif">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-amber-900/70 uppercase tracking-wider font-serif">
                                            Store
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-amber-900/70 uppercase tracking-wider font-serif">
                                            Contact
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-amber-900/70 uppercase tracking-wider font-serif">
                                            Items
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-amber-900/70 uppercase tracking-wider font-serif">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-amber-900/70 uppercase tracking-wider font-serif">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {sales.map((sale) => (
                                        <motion.tr
                                            key={sale._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-amber-50/30 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
                                                    <span className="font-medium text-amber-950">{sale.invoiceNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-stone-400" />
                                                    <span className="text-stone-700 font-light">{sale.customerName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Store size={14} className="text-stone-400" />
                                                    <span className="text-stone-500 font-light">{sale.storeName || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-stone-400" />
                                                    <span className="text-stone-500 font-light">{sale.contactNumber || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-stone-700 font-light">{sale.items.length}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-emerald-700">${sale.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-stone-500 font-light">{formatDate(sale.createdAt)}</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && sales.length > 0 && (
                        <div className="p-4 border-t border-stone-100">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
