'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Plus, Search, Trash } from 'lucide-react';
import Pagination from '@/components/Pagination';

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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Purchase Management</h1>
                <button
                    onClick={() => {
                        setFormData({ supplier: '', invoiceNumber: '', items: [], totalAmount: 0 });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> New Purchase
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by supplier or invoice..."
                        className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Date</th>
                            <th className="p-4 font-medium text-gray-500">Invoice #</th>
                            <th className="p-4 font-medium text-gray-500">Supplier</th>
                            <th className="p-4 font-medium text-gray-500">Items</th>
                            <th className="p-4 font-medium text-gray-500">Total Amount</th>
                            <th className="p-4 font-medium text-gray-500">Created By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center">Loading...</td>
                            </tr>
                        ) : filteredPurchases.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center">No purchases found.</td>
                            </tr>
                        ) : (
                            filteredPurchases.map((purchase) => (
                                <tr key={purchase._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">{purchase.invoiceNumber}</td>
                                    <td className="p-4">{purchase.supplier}</td>
                                    <td className="p-4">
                                        <ul className="list-disc list-inside text-sm">
                                            {purchase.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.rawMaterial?.name} ({item.quantity} @ ${item.unitPrice})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-4 font-bold">${purchase.totalAmount.toFixed(2)}</td>
                                    <td className="p-4">{purchase.user?.name}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchPurchases}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">New Purchase Invoice</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Supplier Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Invoice Number</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.invoiceNumber}
                                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 font-medium">Items</label>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-end">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500">Material</label>
                                            <select
                                                className="w-full p-2 border rounded"
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
                                            <label className="text-xs text-gray-500">Qty</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 border rounded"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="text-xs text-gray-500">Price</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 border rounded"
                                                value={item.unitPrice}
                                                onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-500 hover:text-red-700 mb-2"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end items-center gap-4 mt-6 border-t pt-4">
                                <div className="text-xl font-bold">
                                    Total: ${formData.totalAmount.toFixed(2)}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Create Invoice
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
