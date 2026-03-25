/* eslint-disable @typescript-eslint/no-explicit-any */

import { usePaystackPayment } from 'react-paystack';
import { useCallback } from 'react';
import useAlert from './useAlert';

export interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // Amount in kobo (for NGN) or smallest currency unit
  currency: string;
  publicKey: string;
}

export interface PaystackHookConfig {
  onSuccess?: (reference: any) => void;
  onClose?: () => void;
}

export const usePaystackDonation = (config: PaystackConfig, hookConfig?: PaystackHookConfig) => {
  const handleAlert = useAlert();
  
  const paystackConfig = {
    reference: config.reference,
    email: config.email,
    amount: config.amount,
    currency: config.currency,
    publicKey: config.publicKey,
  };

  const handleSuccess = useCallback((reference: any) => {

    // handleAlert({
    //   variant: 'success',
    //   message: 'Payment successful! Thank you for your donation.'
    // });
    hookConfig?.onSuccess?.(reference);
  }, [handleAlert, hookConfig]);

  const handleError = useCallback((error: any) => {
    console.error('Payment error:', error);
    handleAlert({
      variant: 'error',
      message: 'Payment failed. Please try again.'
    });
  }, [handleAlert]);

  const handleClose = useCallback(() => {

    hookConfig?.onClose?.();
  }, [hookConfig]);

  const initializePayment = usePaystackPayment(paystackConfig);

  const triggerPayment = useCallback(() => {
    initializePayment({
      onSuccess: handleSuccess,
      onClose: handleClose,
    });
  }, [initializePayment, handleSuccess, handleClose]);

  return {
    initializePayment: triggerPayment,
    config: paystackConfig,
  };
};

// Helper function to convert amount to smallest currency unit
export const convertToSmallestUnit = (amount: number, currency: string): number => {
  const multipliers: { [key: string]: number } = {
    'NGN': 100, // kobo
    'USD': 100, // cents
    'GBP': 100, // pence
    'EUR': 100, // cents
  };
  
  return Math.round(amount * (multipliers[currency] || 100));
};

// Helper function to generate unique payment reference
export const generatePaymentReference = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `fs_${timestamp}_${random}`;
};
