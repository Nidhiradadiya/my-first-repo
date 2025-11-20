'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        const publicPaths = ['/login', '/'];

        if (!token && !publicPaths.includes(pathname)) {
            // Redirect to login if no token and trying to access a protected route
            router.push('/login');
            setAuthorized(false);
        } else {
            // If token exists or accessing public path, allow access
            setAuthorized(true);

            // Optional: If user is logged in and tries to access login page, redirect to dashboard
            if (token && pathname === '/login') {
                router.push('/dashboard');
            }
        }
    }, [router, pathname]);

    // Prevent flashing of protected content
    if (!authorized && pathname !== '/login') {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
