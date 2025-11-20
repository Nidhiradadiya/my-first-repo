'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Plus, Edit, Search, X, Loader2, Box } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function RawMaterialsPage() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        stock: 0,
        unit: '',
        pricePerUnit: 0,
        supplier: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMaterials = async (page = 1) => {
        try {
            const { data } = await api.get(`/inventory/raw?page=${page}&limit=10`);
            setMaterials(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
        } catch (error) {
            console.error('Failed to fetch materials', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/inventory/raw/${editId}`, formData);
            } else {
                await api.post('/inventory/raw', formData);
            }
            setShowModal(false);
            setFormData({ name: '', stock: 0, unit: '', pricePerUnit: 0, supplier: '' });
            setIsEditing(false);
            fetchMaterials(currentPage);
        } catch (error) {
            console.error('Failed to save material', error);
        }
    };

    const handleEdit = (material) => {
        setFormData({
            name: material.name,
            stock: material.stock,
            unit: material.unit,
            pricePerUnit: material.pricePerUnit,
            supplier: material.supplier,
        });
        setIsEditing(true);
        setEditId(material._id);
        setShowModal(true);
    };

    const filteredMaterials = materials.filter((material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-stone-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-light text-amber-950">Raw Materials</h1>
                        <p className="text-stone-500 font-light mt-1">Manage your raw material inventory and suppliers</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setFormData({ name: '', stock: 0, unit: '', pricePerUnit: 0, supplier: '' });
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/20 transition-all hover:scale-105 active:scale-95 font-light"
                    >
                        <Plus size={20} /> Add Material
                    </button>
                </div>

                <div className="bg-white p-1 rounded-2xl shadow-sm border border-stone-200 mb-8 max-w-md">
                    <div className="relative group">
                        <Search className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search materials..."
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
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Name</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Stock</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Unit</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Price/Unit</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Supplier</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-stone-400">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Loading inventory...
                                    </td>
                                </tr>
                            ) : filteredMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-stone-400">
                                        <Box className="mx-auto mb-3 opacity-20" size={48} />
                                        No materials found.
                                    </td>
                                </tr>
                            ) : (
                                filteredMaterials.map((material) => (
                                    <tr key={material._id} className="hover:bg-amber-50/30 transition-colors group">
                                        <td className="p-5 font-medium text-amber-950">{material.name}</td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${material.stock > 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                                {material.stock}
                                            </span>
                                        </td>
                                        <td className="p-5 text-stone-600 font-light">{material.unit}</td>
                                        <td className="p-5 text-stone-600 font-light">${material.pricePerUnit}</td>
                                        <td className="p-5 text-stone-600 font-light">{material.supplier}</td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleEdit(material)}
                                                className="text-stone-400 hover:text-amber-600 transition-colors p-2 hover:bg-amber-50 rounded-lg"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </td>
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
                        onPageChange={fetchMaterials}
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
                                className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden border border-stone-100"
                            >
                                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                                    <h2 className="text-xl font-serif font-medium text-amber-950">
                                        {isEditing ? 'Edit Material' : 'Add New Material'}
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                placeholder="e.g., Steel Sheets"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Stock</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Unit</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                    value={formData.unit}
                                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                    required
                                                    placeholder="kg, pcs, etc."
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Price Per Unit</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                    value={formData.pricePerUnit}
                                                    onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Supplier</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                    value={formData.supplier}
                                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                                    placeholder="Supplier Name"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
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
                                            Save Changes
                                        </button>
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
