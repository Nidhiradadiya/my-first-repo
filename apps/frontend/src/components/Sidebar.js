'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Factory,
    LogOut,
    Box,
    FileText,
    ChevronLeft,
    ChevronRight,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Raw Materials', icon: Box, path: '/inventory/raw' },
        { name: 'Finished Products', icon: Package, path: '/inventory/finished' },
        { name: 'Purchase', icon: ShoppingCart, path: '/purchase' },
        {
            name: 'Sales',
            icon: FileText,
            path: '/sales',
            submenu: [
                { name: 'New Sale', path: '/sales' },
                { name: 'Sales History', path: '/sales/history' }
            ]
        },
        { name: 'Manufacturing', icon: Factory, path: '/manufacturing' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        router.push('/login');
    };

    if (pathname === '/login' || pathname === '/') return null;

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 280 }}
            className="h-screen bg-amber-950 text-amber-50 sticky top-0 flex flex-col shadow-2xl z-50 overflow-hidden shrink-0 border-r border-amber-900/50"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-amber-900/50">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/50">
                                <span className="text-lg font-serif font-bold text-white">E</span>
                            </div>
                            <span className="text-xl font-serif font-light text-amber-50">
                                ERP Pro
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-amber-900 text-amber-400 hover:text-amber-100 transition-colors"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path || (item.submenu && item.submenu.some(sub => pathname === sub.path));

                    if (item.submenu) {
                        return (
                            <div key={item.path}>
                                <Link
                                    href={item.path}
                                    className="block"
                                >
                                    <div className={`
                                        flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative group
                                        ${isActive
                                            ? 'bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg shadow-amber-950/50 border border-amber-700/30'
                                            : 'text-amber-200/60 hover:bg-amber-900/50 hover:text-amber-100'
                                        }
                                    `}>
                                        <Icon size={22} className={isActive ? 'text-amber-100' : 'text-amber-200/60 group-hover:text-amber-100'} />
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="font-light whitespace-nowrap"
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {/* Tooltip for collapsed state */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-amber-900 text-amber-50 text-sm font-light rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-amber-800">
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                {!collapsed && (
                                    <div className="ml-8 mt-1 space-y-1 border-l border-amber-900/50 pl-2">
                                        {item.submenu.map((subItem) => (
                                            <Link key={subItem.path} href={subItem.path}>
                                                <div className={`
                                                    p-2 rounded-lg text-sm transition-all font-light
                                                    ${pathname === subItem.path
                                                        ? 'text-amber-100 bg-amber-900/30'
                                                        : 'text-amber-200/50 hover:text-amber-100 hover:bg-amber-900/20'
                                                    }
                                                `}>
                                                    {subItem.name}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="block"
                        >
                            <div className={`
                                flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative group
                                ${isActive
                                    ? 'bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg shadow-amber-950/50 border border-amber-700/30'
                                    : 'text-amber-200/60 hover:bg-amber-900/50 hover:text-amber-100'
                                }
                            `}>
                                <Icon size={22} className={isActive ? 'text-amber-100' : 'text-amber-200/60 group-hover:text-amber-100'} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-light whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-amber-900 text-amber-50 text-sm font-light rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-amber-800">
                                        {item.name}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-amber-900/50 space-y-2 bg-amber-950/50">
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center gap-3 p-3 w-full rounded-xl text-amber-200/60 hover:bg-rose-900/20 hover:text-rose-200 transition-all group
                        ${collapsed ? 'justify-center' : ''}
                    `}
                >
                    <LogOut size={22} />
                    {!collapsed && <span className="font-light">Logout</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
