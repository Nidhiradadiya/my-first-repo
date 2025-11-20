'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Search, ShoppingCart, Trash2, Plus, Save, FileText, Minus, CreditCard, User, Store, Phone, Loader2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function SalesPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [storeName, setStoreName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
    const [taxes, setTaxes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (page = 1) => {
        try {
            const { data } = await api.get(`/inventory/finished?page=${page}&limit=9`); // Limit 9 for grid
            setProducts(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(data.pagination.page);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.product._id === product._id);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { product, quantity: 1, price: product.price }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.product._id !== productId));
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) return;
        setCart(
            cart.map((item) =>
                item.product._id === productId ? { ...item, quantity: newQty } : item
            )
        );
    };

    const calculateSubtotal = () => {
        return cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + Number(taxes);
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || !customerName) {
            alert('Please add items and customer name');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                customerName,
                storeName,
                contactNumber,
                invoiceNumber,
                items: cart.map((item) => ({
                    finishedProduct: item.product._id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                taxes: Number(taxes),
                totalAmount: calculateTotal(),
            };

            await api.post('/sales', payload);
            setSuccessMsg('Invoice created successfully!');

            // Reset form
            setCart([]);
            setCustomerName('');
            setStoreName('');
            setContactNumber('');
            setInvoiceNumber(`INV-${Date.now()}`);
            setTaxes(0);
            fetchProducts(currentPage); // Refresh stock

            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Checkout failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-6 bg-stone-50">
            {/* Left Side: Product Grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-light text-amber-950">New Sale</h1>
                        <p className="text-stone-500 font-light text-sm mt-1">Select products to add to the invoice</p>
                    </div>
                    <div className="relative w-72 group">
                        <Search className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-12 p-3 bg-white border border-stone-200 rounded-xl shadow-sm focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950 placeholder-stone-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={product._id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 cursor-pointer hover:shadow-lg hover:border-amber-200 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        ADD +
                                    </div>
                                    <div className="h-28 bg-stone-50 rounded-xl mb-4 flex items-center justify-center text-stone-300 group-hover:bg-amber-50 group-hover:text-amber-400 transition-colors">
                                        <FileText size={48} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-serif font-medium text-amber-950 truncate text-lg">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-xl font-light text-amber-900">${product.price}</span>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                            {product.stock} in stock
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="text-center text-stone-400 mt-20 flex flex-col items-center">
                            <Search size={48} className="text-stone-200 mb-4" />
                            <p className="text-lg font-light text-stone-500">No products found.</p>
                            <p className="text-sm font-light">Try searching for something else.</p>
                        </div>
                    )}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchProducts}
                />
            </div>

            {/* Right Side: Cart / Invoice */}
            <div className="w-full md:w-[400px] bg-white rounded-2xl shadow-xl border border-stone-200 flex flex-col h-full overflow-hidden">
                <div className="p-6 bg-amber-950 text-amber-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-950 opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-serif font-light flex items-center gap-2">
                                <ShoppingCart size={20} className="text-amber-200" /> Current Bill
                            </h2>
                            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-light border border-white/10">
                                {cart.length} items
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="relative group">
                                <div className="absolute left-3 top-2.5 text-amber-200/50 group-focus-within:text-amber-200 transition-colors">
                                    <FileText size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-9 p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-amber-50 placeholder-amber-200/30 focus:outline-none focus:bg-white/10 focus:border-amber-200/50 transition-all font-light"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    placeholder="Invoice Number"
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-2.5 text-amber-200/50 group-focus-within:text-amber-200 transition-colors">
                                    <User size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-9 p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-amber-50 placeholder-amber-200/30 focus:outline-none focus:bg-white/10 focus:border-amber-200/50 transition-all font-light"
                                    placeholder="Customer Name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-2.5 text-amber-200/50 group-focus-within:text-amber-200 transition-colors">
                                    <Store size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-9 p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-amber-50 placeholder-amber-200/30 focus:outline-none focus:bg-white/10 focus:border-amber-200/50 transition-all font-light"
                                    placeholder="Store Name"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-2.5 text-amber-200/50 group-focus-within:text-amber-200 transition-colors">
                                    <Phone size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-9 p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-amber-50 placeholder-amber-200/30 focus:outline-none focus:bg-white/10 focus:border-amber-200/50 transition-all font-light"
                                    placeholder="Contact Number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50 custom-scrollbar">
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-stone-400 py-20 flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4 border border-stone-200">
                                    <ShoppingCart size={32} className="opacity-30 text-stone-500" />
                                </div>
                                <p className="font-serif font-light text-stone-600">Cart is empty</p>
                                <p className="text-sm mt-1 font-light">Select items from the left to add</p>
                            </motion.div>
                        ) : (
                            cart.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={item.product._id}
                                    className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-stone-200 group hover:border-amber-200 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-serif font-medium text-amber-950">{item.product.name}</p>
                                        <p className="text-xs text-stone-500 font-light mt-1">${item.price} / unit</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-stone-50 rounded-lg p-1 border border-stone-200">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-stone-600"
                                            ><Minus size={14} /></button>
                                            <span className="text-sm font-medium w-8 text-center text-amber-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-stone-600"
                                            ><Plus size={14} /></button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product._id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 bg-white border-t border-stone-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-stone-500 font-light">
                            <span>Subtotal</span>
                            <span className="font-medium text-amber-950">${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-stone-500 font-light items-center">
                            <span>Tax Amount ($)</span>
                            <input
                                type="number"
                                className="w-24 p-1.5 text-right bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100/50 transition-all font-light"
                                value={taxes}
                                onChange={(e) => setTaxes(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex justify-between text-xl font-serif font-medium text-amber-950 pt-4 border-t border-dashed border-stone-200">
                            <span>Total</span>
                            <span className="text-amber-700">${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm font-light rounded-xl text-center border border-emerald-100 flex items-center justify-center gap-2"
                        >
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            {successMsg}
                        </motion.div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white py-4 rounded-xl font-light text-lg shadow-lg shadow-amber-900/20 flex justify-center items-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <CreditCard size={20} /> Complete Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
