'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { FileText, Users, TrendingUp, DollarSign, Phone, Store, Calendar, Filter, User } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sales History</h1>
                        <p className="text-gray-500 mt-1">View all sales and customer analytics</p>
                    </div>
                </div>

                {/* Customer Analytics Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="text-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-900">Customer Analytics</h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === 'recent'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Recent
                            </button>
                            <button
                                onClick={() => setSortBy('mostSales')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === 'mostSales'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Most Sales
                            </button>
                            <button
                                onClick={() => setSortBy('highValue')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === 'highValue'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                                className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={16} className="text-gray-400" />
                                            <h3 className="font-bold text-gray-900">{customer.customerName || 'N/A'}</h3>
                                        </div>
                                        {customer.storeName && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Store size={14} className="text-gray-400" />
                                                <span>{customer.storeName}</span>
                                            </div>
                                        )}
                                        {customer.contactNumber && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} className="text-gray-400" />
                                                <span>{customer.contactNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                                        <p className="text-lg font-bold text-gray-900">{customer.totalSales}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Total Value</p>
                                        <p className="text-lg font-bold text-blue-600">${customer.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        <span>Last sale: {formatDate(customer.lastSaleDate)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {customers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Users size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No customer data available yet.</p>
                        </div>
                    )}
                </div>

                {/* Sales History Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FileText className="text-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-900">All Sales</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-500 mt-4">Loading sales...</p>
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No sales found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Invoice
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Store
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sales.map((sale) => (
                                        <motion.tr
                                            key={sale._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-gray-400" />
                                                    <span className="font-medium text-gray-900">{sale.invoiceNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-gray-400" />
                                                    <span className="text-gray-900">{sale.customerName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Store size={14} className="text-gray-400" />
                                                    <span className="text-gray-600">{sale.storeName || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-gray-400" />
                                                    <span className="text-gray-600">{sale.contactNumber || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900">{sale.items.length}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-blue-600">${sale.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{formatDate(sale.createdAt)}</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && sales.length > 0 && (
                        <div className="p-4 border-t border-gray-100">
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
