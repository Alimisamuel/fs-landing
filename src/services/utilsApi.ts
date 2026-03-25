/* eslint-disable @typescript-eslint/no-explicit-any */

import privateApi from "./api";



export const initiateDonationPayment = async (
  amount: number,
  currency: string,
  callbackUrl: string,
  type?: string,
  recurringFrequency?: string | null
) => {
  const payload = {
    amount,
    currency,
    type,
    message: "Thank you for the amazing content!",
    isAnonymous: false,
    paymentProvider: "flutterwave",
    callbackUrl,
    ...(recurringFrequency ? { recurringFrequency } : {}),
  };
  try {
    const response = await privateApi.post(
      `/users/donations/direct-with-provider`,
      payload
    );

    return {
      success: true,
      data: response.data.data ?? null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Failed to fetch content",
    };
  }
};
