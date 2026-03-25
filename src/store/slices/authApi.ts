import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { UserProfile } from '@/services/profile';
import {  TokenResponse } from "@react-oauth/google";
import { GoogleUserInfo } from '@/features/Auth/GoogleLogin';

// Base URL for your API - adjust this to your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fs.advancedtechnologypark.com';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  phoneNumber: string;
  status: string;
  isApproved: boolean;
  authProvider: string;
  providerId: string | null;
  googleId: string | null;
  facebookId: string | null;
  emailVerified: boolean;
  emailVerificationExpires: string | null;
  passwordResetExpires: string | null;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  lastIp: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  profile:UserProfile
}



export interface LoginRequest {
  email: string;
  password: string;
  userIpAddress:string;
  country:string;
  countryCode:string;
  city:string
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    status: boolean;
    message: string;
    data: User;
    accessToken:string;
    refreshToken:string

  };
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}
export interface GoogleResponse {
  success: boolean;
  message: string;
  data: {
    status: boolean;
    message: string;
    user: User;
    accessToken:string;
    refreshToken:string

  };
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    status: boolean;
    message: string;
    user: User;
  };
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    status: boolean;
    message: string;
    user?: User;
  };
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/register",
        method: 'POST',
        body: {
          firstName : userData.firstName,
          lastName : userData.lastName,
          email : userData.email,
          password : userData.password,
          phoneNumber : userData.phone,
        },
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (refreshData) => ({
        url: '/refresh-token',
        method: 'POST',
        body: refreshData,
      }),
    }),
    verifyEmailFromRegister: builder.mutation<LoginResponse, VerifyEmailRequest>({
      query: (verifyData) => ({
        url: '/verify-email',
        method: 'POST',
        body: verifyData,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    resendVerificationEmail: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (emailData) => ({
        url: '/resend-verification-email',
        method: 'POST',
        body: emailData,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (emailData) => ({
        url: '/forgot-password',
        method: 'POST',
        body: emailData,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; newPassword: string; }>({
      query: (resetData) => ({
        url: '/reset-password',
        method: 'POST',
        body: resetData,
      }),
    }),
    googleLogin: builder.mutation<GoogleResponse, GoogleUserInfo>({
      query: (googleData) => ({
        url: '/google/authenticate',
        method: 'POST',
        body: googleData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailFromRegisterMutation,
  useResendVerificationEmailMutation,
  useGoogleLoginMutation,
} = authApi;
