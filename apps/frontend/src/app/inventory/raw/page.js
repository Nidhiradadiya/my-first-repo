'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Plus, Edit, Search } from 'lucide-react';
import Pagination from '@/components/Pagination';

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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Raw Materials</h1>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: '', stock: 0, unit: '', pricePerUnit: 0, supplier: '' });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Add Material
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search materials..."
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
                            <th className="p-4 font-medium text-gray-500">Unit</th>
                            <th className="p-4 font-medium text-gray-500">Price/Unit</th>
                            <th className="p-4 font-medium text-gray-500">Supplier</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center">Loading...</td>
                            </tr>
                        ) : filteredMaterials.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center">No materials found.</td>
                            </tr>
                        ) : (
                            filteredMaterials.map((material) => (
                                <tr key={material._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{material.name}</td>
                                    <td className="p-4 font-bold">{material.stock}</td>
                                    <td className="p-4">{material.unit}</td>
                                    <td className="p-4">${material.pricePerUnit}</td>
                                    <td className="p-4">{material.supplier}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleEdit(material)}
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
                onPageChange={fetchMaterials}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Material' : 'Add Material'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
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
                                    <label className="block text-gray-700 mb-1">Unit</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Price Per Unit</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        value={formData.pricePerUnit}
                                        onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Supplier</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    />
                                </div>
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
