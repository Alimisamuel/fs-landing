/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from "@/store/slices/authApi";
import { privateApi } from "./api";

export type ProfileType = "adult" | "kids"; // you can extend if needed
export type AgeRating = "G" | "PG" | "PG-13" | "R" | "NC-17"; // example ratings

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  type: ProfileType;
  maxAgeRating: AgeRating;
  isKidsProfile: boolean;
  isActive: boolean;
  isPrimary: boolean;
  autoplayEnabled: boolean;
  notificationsEnabled: boolean;
  preferredGenres: string[];
  preferredLanguages: string[];
  blockedContentTypes: string[];
  watchTimeMinutes: number;
  videosWatched: number;
  lastWatchedAt: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  accessToken:string
}

// For arrays:
export type UserProfiles = UserProfile[];

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ✅ Strongly typed API call
export const getStreamingProfiles = async (): Promise<
  ApiResponse<UserProfiles>
> => {
  try {
    const response = await privateApi.get<{ data: UserProfiles }>(
      `/users/streaming-profiles/with-tokens`
    );

    return {
      success: true,
      data: response.data?.data ?? [],
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to fetch content",
    };
  }
};

export const getCurrentProfile = async (): Promise<
  ApiResponse<User | null>
> => {
  try {
    const response = await privateApi.get<{ data: User }>(`/users/profile`);

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



export const createProfile = async (
  name: string
): Promise<ApiResponse<User | null>> => {
  try {
    const response = await privateApi.post<{ data: User }>(
      `/users/streaming-profiles`,
      { name }
    );

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
