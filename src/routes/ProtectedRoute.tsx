'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '@/store/slices/authSlice';
import GlobalLoading from '@/app/loading';
import { getSelectedExperience } from '@/lib/selectedExperience';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  /** When set, authenticated users without a stored experience are sent to this path */
  requireSelectedExperience?: boolean;
  experienceRedirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = '/auth/login',
  requireSelectedExperience = false,
  experienceRedirectTo = '/experience',
}: ProtectedRouteProps) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }
    if (requireSelectedExperience && !getSelectedExperience()) {
      router.push(experienceRedirectTo);
    }
  }, [
    authLoading,
    experienceRedirectTo,
    isAuthenticated,
    mounted,
    redirectTo,
    requireSelectedExperience,
    router,
  ]);

  const waitingForAuth =
    !mounted || authLoading || (!isAuthenticated && mounted);
  const waitingForExperience =
    isAuthenticated &&
    mounted &&
    requireSelectedExperience &&
    !getSelectedExperience();

  if (waitingForAuth || waitingForExperience) {
    return <GlobalLoading />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
