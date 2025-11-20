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
            className="h-screen bg-slate-900 text-white sticky top-0 flex flex-col shadow-2xl z-50 overflow-hidden shrink-0"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
                                E
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                ERP Pro
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                        }
                                    `}>
                                        <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="font-medium whitespace-nowrap"
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {/* Tooltip for collapsed state */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                {!collapsed && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.submenu.map((subItem) => (
                                            <Link key={subItem.path} href={subItem.path}>
                                                <div className={`
                                                    p-2 rounded-lg text-sm transition-all
                                                    ${pathname === subItem.path
                                                        ? 'bg-blue-500/10 text-blue-400 font-medium'
                                                        : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'
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
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }
                            `}>
                                <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-medium whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        {item.name}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50 space-y-2">
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center gap-3 p-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group
                        ${collapsed ? 'justify-center' : ''}
                    `}
                >
                    <LogOut size={22} />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
