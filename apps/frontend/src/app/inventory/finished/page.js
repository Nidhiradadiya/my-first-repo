'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Plus, Edit, Search, Trash, Loader2, Package, X } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinishedProductsPage() {
    const [products, setProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        stock: 0,
        price: 0,
        recipe: [],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = async (page = 1) => {
        try {
            const { data } = await api.get(`/inventory/finished?page=${page}&limit=10`);
            setProducts(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
        } catch (error) {
            console.error('Failed to fetch products', error);
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
        fetchProducts();
        fetchRawMaterials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/inventory/finished/${editId}`, formData);
            } else {
                await api.post('/inventory/finished', formData);
            }
            setShowModal(false);
            setFormData({ name: '', stock: 0, price: 0, recipe: [] });
            setIsEditing(false);
            fetchProducts(currentPage);
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            stock: product.stock,
            price: product.price,
            recipe: product.recipe.map(r => ({
                rawMaterial: r.rawMaterial._id,
                quantity: r.quantity
            })),
        });
        setIsEditing(true);
        setEditId(product._id);
        setShowModal(true);
    };

    const addRecipeItem = () => {
        setFormData({
            ...formData,
            recipe: [...formData.recipe, { rawMaterial: '', quantity: 1 }],
        });
    };

    const removeRecipeItem = (index) => {
        const newRecipe = [...formData.recipe];
        newRecipe.splice(index, 1);
        setFormData({ ...formData, recipe: newRecipe });
    };

    const updateRecipeItem = (index, field, value) => {
        const newRecipe = [...formData.recipe];
        newRecipe[index][field] = value;
        setFormData({ ...formData, recipe: newRecipe });
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-stone-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-light text-amber-950">Finished Products</h1>
                        <p className="text-stone-500 font-light mt-1">Manage your product catalog and recipes</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setFormData({ name: '', stock: 0, price: 0, recipe: [] });
                            setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-900/20 transition-all hover:scale-105 active:scale-95 font-light"
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>

                <div className="bg-white p-1 rounded-2xl shadow-sm border border-stone-200 mb-8 max-w-md">
                    <div className="relative group">
                        <Search className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
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
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Price</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif">Recipe Items</th>
                                <th className="p-5 font-medium text-amber-900/70 font-serif text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-stone-400">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-stone-400">
                                        <Package className="mx-auto mb-3 opacity-20" size={48} />
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-amber-50/30 transition-colors group">
                                        <td className="p-5 font-medium text-amber-950">{product.name}</td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${product.stock > 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-5 text-stone-600 font-light">${product.price}</td>
                                        <td className="p-5 text-stone-600 font-light">
                                            {product.recipe.length} items
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleEdit(product)}
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
                        onPageChange={fetchProducts}
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
                                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 border border-stone-100 custom-scrollbar"
                            >
                                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 sticky top-0 z-20 backdrop-blur-md">
                                    <h2 className="text-xl font-serif font-medium text-amber-950">
                                        {isEditing ? 'Edit Product' : 'Add New Product'}
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Product Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                placeholder="e.g., Premium Steel Pipe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Current Stock</label>
                                            <input
                                                type="number"
                                                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Selling Price ($)</label>
                                            <input
                                                type="number"
                                                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-sm font-medium text-amber-900">Recipe (Raw Materials)</label>
                                            <button
                                                type="button"
                                                onClick={addRecipeItem}
                                                className="text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-100/50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                + Add Material
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.recipe.map((item, index) => (
                                                <div key={index} className="flex gap-3 items-start">
                                                    <div className="flex-1">
                                                        <select
                                                            className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm font-light text-stone-700"
                                                            value={item.rawMaterial}
                                                            onChange={(e) => updateRecipeItem(index, 'rawMaterial', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Material</option>
                                                            {rawMaterials.map((m) => (
                                                                <option key={m._id} value={m._id}>{m.name} ({m.unit})</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="w-24">
                                                        <input
                                                            type="number"
                                                            placeholder="Qty"
                                                            className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm font-light text-stone-700"
                                                            value={item.quantity}
                                                            onChange={(e) => updateRecipeItem(index, 'quantity', Number(e.target.value))}
                                                            required
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRecipeItem(index)}
                                                        className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.recipe.length === 0 && (
                                                <div className="text-center py-4 text-stone-400 text-sm italic">
                                                    No materials added to recipe yet.
                                                </div>
                                            )}
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
