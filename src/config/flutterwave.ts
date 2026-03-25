// Flutterwave configuration
export const FLUTTERWAVE_CONFIG = {
  // Use environment variable
  PUBLIC_KEY: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || '',
  
  // Supported currencies and their configurations
  CURRENCIES: {
    NGN: {
      name: 'Nigerian Naira',
      symbol: '₦',
    },
    USD: {
      name: 'US Dollars',
      symbol: '$',
    },
    GBP: {
      name: 'British Pounds',
      symbol: '£',
    },
    EUR: {
      name: 'European Union Euro', 
      symbol: '€',
    },
  },
  
  // Default configuration
  DEFAULT_EMAIL: 'user@faithstream.com', // Fallback email
  CALLBACK_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://fs.frontend.advancedtechnologypark.com',
} as const;

export type SupportedCurrency = keyof typeof FLUTTERWAVE_CONFIG.CURRENCIES;
