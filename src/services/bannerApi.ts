/* eslint-disable @typescript-eslint/no-explicit-any */

import { privateApi } from "./api";

// Banner data interface
export interface BannerData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  category: string;
  rating: string;
  year?: number;
  duration?: string;
  genre?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response interface
export interface BannerApiResponse {
  success: boolean;
  message: string;
  data: BannerData[];
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}

export interface Uploader {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  phoneNumber: string | null;
  status: string;
  isApproved: boolean;
  authProvider: string;
  emailVerified: boolean;
  lastLogin: string | null;
  lastIp: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TranscodingJob {
  id: string;
  videoId: string;
  mediaConvertJobId: string;
  status: string;
  inputS3Uri: string;
  outputS3Uri: string;
  hlsManifestUrl: string;
  cloudFrontUrl: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  startedAt: string | null;
  progressPercentage: number;
  errorMessage: string | null;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  episodeCount: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  videoId: string;
  videoStatus: "draft" | "processing" | "published" | "failed";
}
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrls: string[];
  videoUrl: string;
  trailerUrls: string[];
  video:any;
  durationSeconds: number;
  publishedAt: string | null;
  status: string; // draft, uploading, etc.
  type: string; // "movie" | "series_episode" | etc.
  ageRating: string;
  language: string;
  progressPercentage:number;
  lastPositionSeconds:number;
  subtitleLanguages: string[];
  availableRegions: string[];
  blockedRegions: string[];
  primaryRegion: string | null;
  viewCount: number;
  isNew:boolean;
  isInTopTen:boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  averageRating: string;
  ratingCount: number;
  releaseDate: string | null;
  scheduledPublishDate: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  allowComments: boolean;
  allowLikes: boolean;
  allowSharing: boolean;
  keywords: string[];
  metadata: any; // can refine later if you have shape
  uploaderId: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  uploader: Uploader;
  categories: any[]; // refine if categories are typed
  tags: any[];
  genres: any[];
  maturityRating: string | null;
  subtitles: any[];
  thumbnails: any[];
  transcoding: TranscodingJob[];
  contentTypeId:string
  seasons:Season[]
}

export interface Content {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  items: ContentItem[];
}

export interface ContentCreatorResponse {
  success: boolean;
  data: Content;
  message?: string;
}
export interface ContentCatCreatorResponse {
  success: boolean;
  data: {
    data:[];
  }
  message?: string;
}

export const bannerApi = async ({id=""}:{id?:string}): Promise<ContentCreatorResponse> => {
  try {
    const response = await privateApi.get(`/content/banner?contentTypeId=${id}`, {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Override base URL for this specific endpoint
    });

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.error("Error fetching content creator data:", error);
    return {
      success: false,
      data: {
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        items: [],
      },
      message: error.response?.data?.message || "Failed to fetch content",
    };
  }
};
export const contentApi = async (): Promise<ContentCreatorResponse> => {
  try {
    const response = await privateApi.get(`/content`, {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Override base URL for this specific endpoint
    });

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.error("Error fetching content creator data:", error);
    return {
      success: false,
      data: {
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        items: [],
      },
      message: error.response?.data?.message || "Failed to fetch content",
    };
  }
};
export const contentCategoryApi = async ({limit=20,id=""}:{limit?:number, id?:string}): Promise<ContentCatCreatorResponse> => {
  try {
    const response = await privateApi.get(`/content/top-categories?limit=${limit}&contentTypeId=${id}`, {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Override base URL for this specific endpoint
    });

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.error("Error fetching content creator data:", error);
    return {
      success: false,
      data: {
        data :[]
        
      },
      message: error.response?.data?.message || "Failed to fetch content",
    };
  }
};

// Banner API service
