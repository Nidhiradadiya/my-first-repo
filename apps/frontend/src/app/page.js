'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Factory,
  FileText,
  ArrowRight,
  Box
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const modules = [
    {
      name: 'Dashboard',
      description: 'Overview of your business metrics',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'bg-blue-500'
    },
    {
      name: 'Sales',
      description: 'Manage invoices and customers',
      icon: FileText,
      href: '/sales',
      color: 'bg-green-500'
    },
    {
      name: 'Purchase',
      description: 'Track orders and vendors',
      icon: ShoppingCart,
      href: '/purchase',
      color: 'bg-purple-500'
    },
    {
      name: 'Raw Materials',
      description: 'Manage raw material inventory',
      icon: Box,
      href: '/inventory/raw',
      color: 'bg-orange-500'
    },
    {
      name: 'Finished Products',
      description: 'Track finished goods stock',
      icon: Package,
      href: '/inventory/finished',
      color: 'bg-indigo-500'
    },
    {
      name: 'Manufacturing',
      description: 'Production planning and control',
      icon: Factory,
      href: '/manufacturing',
      color: 'bg-pink-500'
    },
  ];

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Welcome to ERP Pro
            </h1>
            <p className="text-lg text-slate-600">
              Select a module to get started
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Link key={module.name} href={module.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group h-full"
                >
                  <div className={`${module.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {module.name}
                  </h2>
                  <p className="text-slate-500">
                    {module.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
            <span className="text-4xl font-bold text-white">E</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            ERP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Pro</span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            A comprehensive solution for your business needs. Manage sales, inventory, manufacturing, and more in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 border border-slate-700 hover:border-slate-600"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 text-slate-500 text-sm">
        © 2024 ERP Pro System. All rights reserved.
      </div>
    </div>
  );
}
