/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useCallback } from 'react';
import useAlert from './useAlert';

export interface FlutterwaveConfig {
  tx_ref: string;
  email: string;
  amount: number;
  currency: string;
  publicKey: string;
  customer: {
    email: string;
    name?: string;
    phone_number?: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
}

export interface FlutterwaveHookConfig {
  onSuccess?: (response: any) => void;
  onClose?: () => void;
}

export const useFlutterwaveDonation = (config: FlutterwaveConfig, hookConfig?: FlutterwaveHookConfig) => {
  const handleAlert = useAlert();
  
  const flutterwaveConfig = {
    public_key: config.publicKey,
    tx_ref: config.tx_ref,
    amount: config.amount,
    currency: config.currency,
    payment_options: 'card,mobilemoney,ussd,banktransfer',
    customer: {
      email: config.customer.email,
      phone_number: config.customer.phone_number || '',
      name: config.customer.name || 'Faithstream User',
    },
    customizations: {
      title: config.customizations.title,
      description: config.customizations.description,
      logo: config.customizations.logo || '',
    },
  };

  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

  const handleSuccess = useCallback((response: any) => {
    closePaymentModal();
    hookConfig?.onSuccess?.(response);
  }, [hookConfig]);

  const handleClose = useCallback(() => {
    closePaymentModal();
    hookConfig?.onClose?.();
  }, [hookConfig]);

  const triggerPayment = useCallback(() => {
    handleFlutterPayment({
      callback: (response: any) => {
        if (response.status === 'successful') {
          handleSuccess(response);
        } else {
          handleAlert({
            variant: 'error',
            message: 'Payment failed. Please try again.'
          });
          handleClose();
        }
      },
      onClose: handleClose,
    });
  }, [handleFlutterPayment, handleSuccess, handleClose, handleAlert]);

  return {
    initializePayment: triggerPayment,
    config: flutterwaveConfig,
  };
};

// Helper function to generate unique transaction reference
export const generateTransactionReference = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `fs_${timestamp}_${random}`;
};
