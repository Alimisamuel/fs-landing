/* eslint-disable @typescript-eslint/no-explicit-any */

import privateApi from "./api";
import { ApiResponse } from "./profile";

export const initiateDonation = async (
  contentCreatorId: string,
  videoId: string,
  amount: number,
  currency: string,
  callbackUrl:string,
  type?: string,
  message?: string,
  isAnonymous?: boolean,
  paymentMethod?: string,
) => {
  const payload = {
    contentCreatorId,
    videoId,
    amount,
    currency,
    callbackUrl,
    type: type || "one_time",
    message: message || "Thank you for the amazing content!",
    isAnonymous: isAnonymous || false,
    paymentMethod: paymentMethod || "card",
  };
  try {
    const response = await privateApi.post(`/users/donations`, payload);

    return {
      success: true,
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Failed to fetch content",
    };
  }
};
