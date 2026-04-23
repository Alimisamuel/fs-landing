import { useMemo } from "react";
import { useGetQuery } from "./useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";


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
     experienceGroup:{
       contentTypes: ContentNav[]
       name:string
     }
   }
   status:string;
   message:string;
}

export const useContentCategories = (slug?: string) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isPending, data, refetch } = useGetQuery<NavResponse>(
    ["navs"],
    "/users/me/experience-group-status",
    isAuthenticated
  );

  console.log("useContentCategories data:", data?.data
);

  // all categories
  const categories = data?.data?.experienceGroup?.contentTypes || [];
  const currentExperience = data?.data?.experienceGroup?.name

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
    currentExperience
  };
};
