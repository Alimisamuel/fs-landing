/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setCredentials, 
  logout as logoutAction, 
  setLoading, 
  setError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthError,
  selectAuthLoading
} from '@/store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyEmailFromRegisterMutation,
  useResendVerificationEmailMutation,
  useResetPasswordMutation,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  useForgotPasswordMutation,
 

} from '@/store/slices/authApi';
import { useCallback } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Selectors
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectAuthLoading);
  
  // API mutations
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [verifyEmailMutation] = useVerifyEmailFromRegisterMutation();
  const [resendOtpMutation] = useResendVerificationEmailMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation()
  const [resetPasswordMutation] = useResetPasswordMutation()



  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await loginMutation(credentials).unwrap();

      dispatch(setCredentials({
        user: result.data.data,
        token: result.data.accessToken,
        refreshToken: result.data.refreshToken
      }));
      
      router.push('/team');
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Login failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, loginMutation, router]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await registerMutation(userData).unwrap();
      
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Registration failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, registerMutation]);





  const verifyEmail = useCallback(async (verifyData: VerifyEmailRequest) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await verifyEmailMutation(verifyData).unwrap();
         dispatch(setCredentials({
        user: result.data.data,
        token: result.data.accessToken,
        refreshToken: result.data.refreshToken
      }));
      
      
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Email verification failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, verifyEmailMutation]);

  const resendOtp = useCallback(async (email: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await resendOtpMutation({ email }).unwrap();
      
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Resend OTP failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, resendOtpMutation]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await forgotPasswordMutation({ email }).unwrap();
      
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Forgot password failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, forgotPasswordMutation]);

  const resetPassword = useCallback(async (token: string, newPassword:string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await resetPasswordMutation({ token, newPassword }).unwrap();
      
      return { success: true, data: result };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Forgot password failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, resetPasswordMutation]);

  const logout = useCallback(async () => {
    try {
      // Call logout API if needed
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state regardless of API call result
      dispatch(logoutAction());
      router.push('/auth/login');
    }
  }, [dispatch, logoutMutation, router]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resendOtp,
    clearError,
    resetPassword
  };
};
