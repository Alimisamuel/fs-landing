// Paystack configuration
export const PAYSTACK_CONFIG = {
  // Use environment variables or fallback to test keys
  PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_0a397c19e9099bc579263d59d826704a74717276',
  
  // Supported currencies and their configurations
  CURRENCIES: {
    NGN: {
      name: 'Nigerian Naira',
      symbol: '₦',
      multiplier: 100, // Convert to kobo
    },
    USD: {
      name: 'US Dollars',
      symbol: '$',
      multiplier: 100, // Convert to cents
    },
    GBP: {
      name: 'British Pounds',
      symbol: '£',
      multiplier: 100, // Convert to pence
    },
    EUR: {
      name: 'European Union Euro', 
      symbol: '€',
      multiplier: 100, // Convert to cents
    },
  },
  
  // Default configuration
  DEFAULT_EMAIL: 'user@faithstream.com', // Fallback email
  CALLBACK_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://fs.frontend.advancedtechnologypark.com',
} as const;

export type SupportedCurrency = keyof typeof PAYSTACK_CONFIG.CURRENCIES;
