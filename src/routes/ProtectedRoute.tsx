'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '@/store/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';
import GlobalLoading from '@/app/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, authLoading, mounted, router, redirectTo]);

  // Show loading while checking authentication
  if (!mounted || authLoading || (!isAuthenticated && mounted)) {
    return (
    <GlobalLoading/>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
