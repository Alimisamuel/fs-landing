/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Check, ChevronDown, Plus, ThumbsUp } from "lucide-react";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosPlay } from "react-icons/io";
import { useMovieContext } from "@/contexts/MovieContext";
import { useCardContext } from "@/contexts/CardContext";
import { useUtilsContext } from "@/contexts/UtilsContext";
import { ContentItem } from "@/services/bannerApi";
import {
  formatEpisodeDuration,
  getSafeMediaUrl,
  THUMBNAIL_FALLBACK,
} from "@/utils/helpers";
import FsSmartImage from "../UI/FsSmartImage";

// const src =
//   "https://res.cloudinary.com/dvu4qhyqq/video/upload/v1751612942/newmov_rg94fr.mov";

interface PopUpCardProps {
  isHovered: boolean;
  x: number;
  y: number;
}

const PopUpCard: FC<PopUpCardProps> = ({ isHovered, x, y }) => {
  const { setModalOpen, setSelectedMovie } = useMovieContext();
  const { cardState, setCardState } = useCardContext();
  const { addToFavoriteList, isInFavorites, movieList, isItemMutating } =
    useUtilsContext();

  // const [trailerUrl, setTrailerUrl] = useState<string>("");
  // const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [movieId, setMovieId] = useState<string>("");
  const [favData, setFavData] = useState<ContentItem | null>(null);
  const [addedToFavorite, setAddedToFavorite] = useState<boolean>(false);

  const handlePopoverMouseLeave = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCardState({
      ...cardState,
      isHovered: false,
      cardId: null,
      item: null,
    });

    // setShowTrailer(false);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    popupCard: {
      backgroundColor: "#141414",
      boxShadow:
        "rgba(0,0,0,0.2) 0px 2px 1px 1px, rgba(0,0,0,0.14) 0px 1px 1px 0px, rgba(0,0,0,0.12) 0px 1px 3px 0px",
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05))",
      borderRadius: "8px",
      transformOrigin: "center",
      position: "fixed",
      width: "320px",
      zIndex: 1000,
      overflow: "hidden",
    },
    popupScaleDown: {
      transform: "translate(-50%, -100%) scale(0.8)",
      opacity: 0,
    },
    popupScaleUp: {
      transform: "translate(-50%, -100%) scale(1)",
      opacity: 1,
    },
    transitionAll: {
      transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      if (cardState.isHovered) {
        setCardState({
          ...cardState,
          isHovered: false,
        });
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [cardState.isHovered, setCardState, cardState]);

  useEffect(() => {
    if (cardState.item) {
      setImageUrl(
  cardState?.item?.thumbnailUrls?.[0] ??
  cardState?.item?.thumbnails?.[0] ??
  ""
);

      // setTitle(cardState.item.title || "MOVIE");
      setMovieId(cardState?.item.id ?? 0);
      setFavData(cardState.item);

      // check if added to list using API data
      setAddedToFavorite(isInFavorites(cardState.item.id));

      // const fetchTrailer = async () => {
      //   const trailerRes = await tmdbApi.getMovieTrailer(cardState.item.id);

      //   if (trailerRes.error) {
      //     setTrailerUrl("");
      //   } else if (trailerRes.data) {
      //     setTrailerUrl(trailerRes.data.results[0].key);
      //   }
      // };

      // fetchTrailer();
    }
  }, [cardState]);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    setIsVideoLoaded(false);
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [cardState]);

  // Update addedToFavorite when movieList changes
  useEffect(() => {
    if (cardState.item) {
      setAddedToFavorite(isInFavorites(cardState?.item?.id));
    }
  }, [movieList, cardState.item, isInFavorites]);

  const seasonList = ((cardState?.item as any)?.seasons ??
    (cardState?.item as any)?.season ??
    []) as any[];
  const hasSeasons = Array.isArray(seasonList) && seasonList.length > 0;

  return (
    <div
      className="text-white flex flex-col z-40"
      data-popup-id={cardState.item?.id}
      style={
        {
          ...styles.popupCard,
          top: `${y + 270}px`,
          left: `${
            x < 200 ? x + 60 : window.innerWidth - x < 200 ? x - 60 : x
          }px`,
          animationName: isHovered ? "card" : "card-exit",
          ...(isHovered ? styles.popupScaleUp : styles.popupScaleDown),
          ...styles.transitionAll,
        } as React.CSSProperties
      }
      onMouseLeave={handlePopoverMouseLeave}
      onAnimationEnd={(e) => {
        if (e.animationName === "card-exit") {
          handlePopoverMouseLeave();
        }
      }}
    >
      <div className="relative w-full h-[170px] bg-gradient-to-b from-primary/50 to-black overflow-hidden ">
        <div className="pointer-events-none w-full h-full">
          <div className="absolute top-0 left-0 w-screen h-full bg-primary/80 mix-blend-multiply z-20 " />
          {cardState?.item?.trailerUrls?.[0] && (
            <video
              autoPlay
              loop
              muted
              playsInline
              src={getSafeMediaUrl(cardState?.item?.trailerUrls?.[0])}
              onCanPlayThrough={() => {
                setTimeout(() => {
                  setIsVideoLoaded(true);
                }, 500); // Optional delay for a smoother transition
              }}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                isVideoLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        {/* Image always present, fades out when video is loaded */}
        <div
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            isVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url('${imageUrl || THUMBNAIL_FALLBACK}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="flex justify-between items-center p-4 bg-[#141414]">
        <div className="flex space-x-2">
          {
            hasSeasons ? (
              <div
             onClick={() => {
            setModalOpen(true);
            setSelectedMovie(favData as ContentItem);
            setCardState({
              ...cardState,
              isHovered: false,
              cardId: null,
              item: null,
            });
          }}
            className="rounded-full bg-white transition-colors duration-200 flex flex-row items-center cursor-pointer justify-center h-[46px] w-[46px]"
          >
            <IoIosPlay size={20} className="h-6 w-6 text-[#141414]" />
          </div>
            ):(
              <Link
            href={`/watch/${cardState?.item?.id || ""}?title=${
              cardState.item?.title
            }&progress=${cardState?.item?.lastPositionSeconds}`}
            className="rounded-full bg-white transition-colors duration-200 flex flex-row items-center justify-center h-[46px] w-[46px]"
          >
            <IoIosPlay size={20} className="h-6 w-6 text-[#141414]" />
          </Link>
            )
          }

          <button
            className="rounded-full transition-colors
             duration-200 flex flex-row items-center justify-center h-[46px] w-[46px] border-2  border-[#FFFFFF80] bg-[#2A2A2A] hover:border-white"
            onClick={() => {
              addToFavoriteList(favData as ContentItem);
            }}
          >
            {isItemMutating(favData?.id || "") ? (
              <div className="loader_slow"></div>
            ) : addedToFavorite ? (
              <Check size={20} className="h-6 w-6" />
            ) : (
              <Plus size={20} className="h-6 w-6" />
            )}
          </button>

          <button
            className="rounded-full transition-colors
             duration-200 flex flex-row items-center justify-center h-[46px] w-[46px] border-2  border-[#FFFFFF80] bg-[#2A2A2A] hover:border-white
             "
          >
            <ThumbsUp size={20} className="h-6 w-6" />
          </button>
        </div>
        <button
          className="rounded-full transition-colors
             duration-200 flex flex-row items-center justify-center h-[46px] w-[46px] border-2  border-[#FFFFFF80] bg-[#2A2A2A] hover:border-white"
          onClick={() => {
            setModalOpen(true);
            setSelectedMovie(favData as ContentItem);
            setCardState({
              ...cardState,
              isHovered: false,
              cardId: null,
              item: null,
            });
          }}
        >
          <ChevronDown size={20} className="h-6 w-6" />
        </button>
      </div>
      <div className="p-4 bg-[#141414]">
        <div className="flex gap-3">
          {/* <span className="text-green-400">70% Match</span> */}
          {cardState?.item?.ageRating && (
            <span className="border-[1px] px-2 border-[#808080] rounded-sm text-xs flex flex-row items-center justify-center">
              {cardState.item?.ageRating}
            </span>
          )}
          <span className="border-[1px] px-2 border-[#808080] rounded-sm text-xs flex flex-row items-center justify-center">
            HD
          </span>
          {parseFloat(formatEpisodeDuration(cardState?.item?.durationSeconds)) >
            0 && (
            <span className="text-[#BCBCBC] text-[12px] ">
              {formatEpisodeDuration(cardState?.item?.durationSeconds)}
            </span>
          )}
          {
            hasSeasons && (
              <span className="text-[#BCBCBC] text-[12px] ">
              {seasonList?.length} Season
            </span>
            )
          }
        </div>
        <div className="mt-2 text-sm flex space-x-2 mb-2 capitalize">
          <span>{cardState?.item?.keywords?.join(" • ")}</span>
        </div>
      </div>
    </div>
  );
};

export default PopUpCard;
