import { useMemo } from "react";
import { useGetQuery } from "./useQuery";


export interface ContentNav {
 id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  bannerImage: string | null;
  isActive: boolean;
  sortOrder: number;
  isDefault: boolean;
  isFeatured: boolean;
  allowedAgeRatings: string[];
  metadata: string;
  videoCount: number;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NavResponse {
  data:{
     contentTypes:ContentNav[]
   }
   status:string;
   message:string;
}

export const useContentCategories = (slug?: string) => {
  const { isPending, data, refetch } = useGetQuery<NavResponse>(
    ["navs"],
    "/content/content-types/list"
  );

  // all categories
  const categories = data?.data?.contentTypes || [];;

  // single category by slug
  const selectedCategory = useMemo(() => {
    if (!slug || !categories?.length) return null;

    return (
      categories.find(
        (cat) => cat.slug.toLowerCase() === slug.toLowerCase()
      ) || null
    );
  }, [slug, categories]);

  return {
    isPending,
    categories, // all navs
    selectedCategory, // single object if slug provided
    refetch,
  };
};
