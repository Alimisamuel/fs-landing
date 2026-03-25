"use client";

import { FC, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";
import { IoIosPlay } from "react-icons/io";
import { useMovieContext } from "@/contexts/MovieContext";
import { ContentItem } from "@/services/bannerApi";
import { useUtilsContext } from "@/contexts/UtilsContext";
import { Check, Plus } from "lucide-react";

interface SimilarMoviesCardProps {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  movieData: ContentItem;
}

const SimilarMoviesCard: FC<SimilarMoviesCardProps> = ({
  title,
  description,
  imageUrl,
  duration,
  movieData,
}) => {
  const { setModalOpen } = useMovieContext();
  const router = useRouter();
  const [imageSrc] = useState(imageUrl);

  const {
    addToFavoriteList,
    randomDuration,
    isInFavorites,
    movieList,
    isItemMutating,
  } = useUtilsContext();

  const [addedToFavorite, setAddedToFavorite] = useState<boolean>(false);

  useState<boolean>(false);

  useEffect(() => {
    if (!movieData) return;

    // Use API data instead of localStorage
    setAddedToFavorite(isInFavorites(movieData.id));
  }, [movieData?.id, isInFavorites]);

  // Update addedToFavorite when movieList changes
  useEffect(() => {
    if (movieData) {
      setAddedToFavorite(isInFavorites(movieData.id));
    }
  }, [movieList, movieData?.id, isInFavorites]);

  const navigateToWatch = () => {
    const watchParams = new URLSearchParams({
      title: movieData?.title || "Now Playing",
      progress: String(movieData?.lastPositionSeconds || 0),
    });

    setModalOpen(false);
    router.push(`/watch/${movieData.id}?${watchParams.toString()}`);
  };

  return (
    <div className="bg-[#181818] text-white rounded-[4px] shadow-md">
      <div
        style={{ background: `url('${imageSrc}')`, backgroundSize: "cover" }}
        className="group relative rounded-t-[4px] w-full h-30 cursor-pointer"
        onClick={navigateToWatch}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigateToWatch();
          }
        }}
        role="button"
        tabIndex={0}
      >
        
        <div>
          <div className="absolute top-2 left-2">
            <Image
              src="/logo/logo_white.svg"
              alt="Logo"
              width={18}
              height={18}
            />
          </div>
          <div className="absolute top-2 right-2 bg-[#000000b3] text-white px-2 py-0.5 rounded-sm text-xs ">
            {duration}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            aria-label={`Play ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              navigateToWatch();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
          >
            <IoIosPlay size={22} className="ml-0.5" />
          </button>
        </div>

        <h3 className="absolute bottom-0 left-2 font-semibold text-base mb-1.5">
          {title && title.length > 20
            ? title.slice(0, 20) + "..."
            : title || "Untitled"}
        </h3>
      </div>

      <div className="p-3 bg-[#000] rounded-b-[4px] h-[200px]">
        <div className="flex flex-col text-sm mb-1">
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-between">
              {/* <div className="text-[#46d369] text-[10px]">
                <span>{movieData?.relevanceScore}% Match</span>
              </div> */}

              <div className="flex flex-row items-center gap-x-2">
                <span className="border-[1px] px-2 border-[#808080] rounded-xs text-[8px] flex flex-row items-center justify-center text-[#E5E5E5] font-bold py-1">
                  {movieData?.ageRating}
                </span>
                {/* <span className="border-[1px] px-2 border-[#808080] rounded-xs text-[8px] flex flex-row items-center justify-center text-[#E5E5E5]">
                  {movieData?.maturityRating}
                </span> */}
                {movieData?.tags?.map((mov, idx) => (
                  <span key={idx} className="text-[12px] capitalize text-[#E5E5E5]">
                    {mov?.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  addToFavoriteList(movieData);
                }}
                className="rounded-full transition-colors
             duration-200 flex flex-row items-center justify-center h-[46px] w-[46px] border-2  border-[#FFFFFF80] bg-[#2A2A2A] hover:border-white"
              >
                {isItemMutating(movieData.id) ? (
                  <div className="loader_slow"></div>
                ) : (
                  <>
                    {addedToFavorite ? (
                      <Check className="text-white h-6 w-6" />
                    ) : (
                      <Plus className="text-white h-6 w-6" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#b3b3b3] mb-3 leading-tight mt-3">
          {description && description.length > 50
            ? description.slice(0, 200) + "..."
            : description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default SimilarMoviesCard;
