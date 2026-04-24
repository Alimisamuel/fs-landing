/* eslint-disable @typescript-eslint/no-explicit-any */

import { ContentItem } from "@/services/bannerApi";

/**
 * Utility function to mark videos with isRecent flag based on their presence in "New on FaithStream" category
 */

export interface VideoWithRecentFlag extends ContentItem {
  isRecent?: boolean;
}

export const addRecentFlagToVideos = (
  allVideos: ContentItem[],
  categoryData: any[]
): VideoWithRecentFlag[] => {
  const categories = Array.isArray(categoryData)
    ? categoryData.filter(Boolean)
    : [];
  // Find the "New on FaithStream" category and extract video IDs
  const recentCategory = categories.find(
    (category: any) =>
      category.categoryName === "New on FaithStream" ||
      category.categoryName === "New in FaithStream" ||
      category.categoryName?.toLowerCase().includes("new"),
  );

  const recentVideoIds = new Set(
    recentCategory?.videos?.map((video: any) => video.id) || []
  );

  // Add isRecent flag to all videos
  return allVideos.map((video: ContentItem): VideoWithRecentFlag => ({
    ...video,
    isRecent: recentVideoIds.has(video.id)
  }));
};

export const addRecentFlagToCategory = (
  categoryVideos: ContentItem[],
  isRecentCategory: boolean
): VideoWithRecentFlag[] => {
  return categoryVideos.map((video: ContentItem): VideoWithRecentFlag => ({
    ...video,
    isRecent: isRecentCategory
  }));
};

/**
 * Process categories and mark videos with recent flags
 */
export const processCategoriesWithRecentFlags = (
  categoryData: any[]
): any[] => {
  if (!categoryData) return [];

  const categories = categoryData.filter(Boolean);

  // Find recent video IDs first
  const recentCategory = categories.find(
    (category: any) =>
      category.categoryName === "New on FaithStream" ||
      category.categoryName === "New in FaithStream" ||
      category.categoryName?.toLowerCase().includes("new"),
  );

  const recentVideoIds = new Set(
    recentCategory?.videos?.map((video: any) => video.id) || []
  );

  // Process all categories and mark videos
  return categories.map((category: any) => ({
    ...category,
    videos: category.videos?.map((video: any) => ({
      ...video,
      isRecent: recentVideoIds.has(video.id)
    })) || []
  }));
};
