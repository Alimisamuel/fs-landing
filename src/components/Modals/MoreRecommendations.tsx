import { usePostMutation } from "@/hooks/useQuery";
import React, { useEffect } from "react";
import SimilarMoviesCard from "./SimilarMovies";
import { ContentItem } from "@/services/bannerApi";
import { THUMBNAIL_FALLBACK } from "@/utils/helpers";

interface payload {
  limit: number;
  videoId: string;
}

interface RecommendResponse {
  data: {
    data: {
      videos: ContentItem[];
    };
  };
  status: string;
}

const MoreRecommendations = ({ videoId = "" }: { videoId: string }) => {
  const { mutate, isPending, data } = usePostMutation<
    RecommendResponse,
    payload
  >(`/content/content-types/recommendations`, false, ["search", videoId]);

  useEffect(() => {
    mutate({
      limit: 10,
      videoId: videoId,
    });
  }, [videoId]);

  const randomDuration = () => {
    const randomMins = Math.floor(Math.random() * (200 - 60 + 1)) + 60;
    const hrs = Math.floor(randomMins / 60);
    const mins = randomMins % 60;

    return `${hrs}h ${mins}m`;
  };

  const TrendingMovies = data?.data?.data?.videos || [];
  return (
    <div>
      {isPending && (
        <p className="mt-4 text-center">Loading Similar Movies....</p>
      )}

      {TrendingMovies?.length == 0 && !isPending && (
        <p className="mt-4 text-center">No Similar Movies Found....</p>
      )}

      {TrendingMovies?.length > 0 && (
        <div className="mt-4">
          <p className="text-xl mt-15 mb-4">More Recomendation</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TrendingMovies?.slice(0, 6).map((movie) => (
              <SimilarMoviesCard
                movieData={movie}
                key={movie.id}
                id={`${movie.id}`}
                duration={randomDuration()}
                title={movie.title || "Untitled"}
                description={movie.description || "No description available"}
                imageUrl={
                  movie?.thumbnailUrls?.[0] ??
                  movie?.thumbnails?.[0] ??
                  THUMBNAIL_FALLBACK
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreRecommendations;
