import Carousel from "@/components/Sliders/Carousel";
import { useContentData, useContentCategoryData } from "@/hooks/useBannerData";
import { TrendingMovies } from "@/lib/constants/mock";
import { StreamingProfile } from "@/lib/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addRecentFlagToVideos } from "@/utils/videoProcessing";

const Watching = () => {
  const {
    data: contentData,
    isLoading: contentLoading,
    error: contentError,
  } = useContentData();
  
  const {
    data: contentCategoryData,
  } = useContentCategoryData();
  
  // Process videos with recent flags
  const videosWithRecentFlags = addRecentFlagToVideos(
    contentData?.data?.items || [],
    contentCategoryData?.data?.data || []
  );

  const [profile, setProfile] = useState<StreamingProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedProfile = localStorage.getItem("streaming_profile");
    if (!storedProfile) {
      router.push("/team");
    } else {
      setProfile(JSON.parse(storedProfile));
    }
  }, [router]);

  return (
    <>
      <div className="w-[95vw] ml-auto mt-10">
        <Carousel
          title={`Continue Watching for ${profile?.name}`}
          items={videosWithRecentFlags?.slice(0, 4) || []}
          watching={true}
        />
      </div>
    </>
  );
};

export default Watching;
