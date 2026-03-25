import { useQuery } from "@tanstack/react-query";
import {
  bannerApi,
  BannerData,
  BannerApiResponse,
  contentApi,
  contentCategoryApi,
} from "@/services/bannerApi";

// Query keys for better cache management
export const BANNER_QUERY_KEYS = {
  all: ["banners"] as const,
  list: () => [...BANNER_QUERY_KEYS.all, "list"] as const,
} as const;

// Custom hook to fetch banner data
export const useBannerData = (id?:string) => {
  return useQuery({
    queryKey: ["banners", id],
    queryFn: ()=>bannerApi({id}),
    staleTime: 0,
    gcTime: 10 * 60 * 1000, 
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useContentData = () => {
  return useQuery({
    queryKey: ["content"],
    queryFn: contentApi,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useContentCategoryData = (limit?: number, id?: string) => {
  return useQuery({
    queryKey: ["content-category", limit, id],

    queryFn: () =>
      contentCategoryApi({
        limit,
        id,
      }),

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
