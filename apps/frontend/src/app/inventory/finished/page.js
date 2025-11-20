'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Plus, Edit, Search, Trash } from 'lucide-react';
import Pagination from '@/components/Pagination';

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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Finished Products</h1>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: '', stock: 0, price: 0, recipe: [] });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
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
                            <th className="p-4 font-medium text-gray-500">Name</th>
                            <th className="p-4 font-medium text-gray-500">Stock</th>
                            <th className="p-4 font-medium text-gray-500">Price</th>
                            <th className="p-4 font-medium text-gray-500">Recipe Items</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">Loading...</td>
                            </tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">No products found.</td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4 font-bold">{product.stock}</td>
                                    <td className="p-4">${product.price}</td>
                                    <td className="p-4">
                                        {product.recipe.length} items
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:text-blue-800"
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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchProducts}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 font-medium">Recipe (Raw Materials)</label>
                                    <button
                                        type="button"
                                        onClick={addRecipeItem}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                                {formData.recipe.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <select
                                            className="flex-1 p-2 border rounded"
                                            value={item.rawMaterial}
                                            onChange={(e) => updateRecipeItem(index, 'rawMaterial', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Material</option>
                                            {rawMaterials.map((m) => (
                                                <option key={m._id} value={m._id}>{m.name} ({m.unit})</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            className="w-24 p-2 border rounded"
                                            value={item.quantity}
                                            onChange={(e) => updateRecipeItem(index, 'quantity', Number(e.target.value))}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeRecipeItem(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
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
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
