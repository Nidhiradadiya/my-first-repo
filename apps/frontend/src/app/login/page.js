'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, ContactShadows, Environment, Torus, Cone, Sphere } from '@react-three/drei';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import * as THREE from 'three';

// --- 3D Background Components ---

function FloatingShapes() {
    return (
        <>
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Torus args={[0.8, 0.2, 16, 100]} position={[-3, 2, -2]} rotation={[0.5, 0.5, 0]}>
                    <meshStandardMaterial color="#D97706" roughness={0.1} metalness={0.8} />
                </Torus>
            </Float>

            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
                <Cone args={[0.8, 1.5, 32]} position={[3.5, -1, -3]} rotation={[0, 0, 0.5]}>
                    <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.6} />
                </Cone>
            </Float>

            <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere args={[0.6, 32, 32]} position={[-2, -3, -1]}>
                    <meshPhysicalMaterial
                        color="#FFFBEB"
                        roughness={0}
                        metalness={0.1}
                        transmission={0.9}
                        thickness={2}
                    />
                </Sphere>
            </Float>

            <Float speed={1.8} rotationIntensity={1} floatIntensity={2}>
                <Torus args={[0.5, 0.15, 16, 100]} position={[3, 3, -4]} rotation={[-0.5, -0.2, 0]}>
                    <meshPhysicalMaterial
                        color="#FCD34D"
                        roughness={0.1}
                        metalness={0.9}
                    />
                </Torus>
            </Float>
        </>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Environment preset="city" />
            <FloatingShapes />
            <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
        </>
    );
}

// --- Main Login Component ---

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#FDFBF7] overflow-hidden flex items-center justify-center">

            {/* 3D Background Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <Scene />
                    </Suspense>
                </Canvas>
            </div>

            {/* Content Layer */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Glass Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden">
                    <div className="p-8 md:p-10">

                        {/* Header */}
                        <div className="text-center mb-10">
                            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl mb-6 shadow-lg shadow-amber-900/20 group hover:scale-110 transition-transform">
                                <span className="text-2xl font-serif font-bold text-white">E</span>
                            </Link>
                            <h1 className="text-3xl font-serif font-light text-amber-950 mb-2">Welcome Back</h1>
                            <p className="text-stone-500 font-light text-sm">Sign in to continue to your dashboard</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-3 bg-rose-50/80 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-700 text-sm font-light"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-amber-900/60 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        className="w-full pl-11 pr-4 py-3 bg-white/50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950 placeholder-stone-400"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-semibold text-amber-900/60 uppercase tracking-wider">Password</label>
                                    <a href="#" className="text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        className="w-full pl-11 pr-4 py-3 bg-white/50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 transition-all font-light text-amber-950 placeholder-stone-400"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white py-3.5 rounded-xl font-light text-lg transition-all hover:shadow-lg hover:shadow-amber-900/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center pt-6 border-t border-stone-200/50">
                            <p className="text-stone-500 font-light text-sm">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-amber-800 font-medium hover:text-amber-950 hover:underline transition-colors">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Text */}
                <p className="text-center text-stone-400 text-xs mt-8 font-light">
                    © 2024 ERP Pro System. Secure Login.
                </p>
            </motion.div>
        </div>
    );
}
