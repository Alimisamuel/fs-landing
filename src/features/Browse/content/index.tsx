/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import GlobalLoading from "@/app/loading";
import HomeBanner from "@/components/Banners/HomeBanner";
import ContentLikes from "@/components/cards/components/ContentLikes";
import { HomeHeader } from "@/components/header";
import MoreRecommendations from "@/components/Modals/MoreRecommendations";
import { useMovieContext } from "@/contexts/MovieContext";
import { useUtilsContext } from "@/contexts/UtilsContext";
import { useGetQuery } from "@/hooks/useQuery";
import { ContentItem } from "@/services/bannerApi";
import { getSafeMediaUrl, THUMBNAIL_FALLBACK } from "@/utils/helpers";
import { Button, IconButton } from "@mui/material";
import { Check, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosPlay } from "react-icons/io";
import { PiSpeakerHighLight, PiSpeakerSlashThin } from "react-icons/pi";
import { RiShareLine } from "react-icons/ri";

interface ContentRes {
  data: ContentItem;
  message: string;
  method: string;
  path: string;
  status: boolean;
  statusCode: number;
  timestamp: string;
}


const ContentOverview = () => {
  const {
    addToFavoriteList,
    randomDuration,
    isInFavorites,
    movieList,
    isItemMutating,
  } = useUtilsContext();
  const params = useParams();
  const content_id = decodeURIComponent(params.id as string);
  const [isModalMuted, setIsModalMuted] = useState(true);
  const [addedToFavorite, setAddedToFavorite] = useState<boolean>(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");

  const router = useRouter();
  const { selectedMovie } = useMovieContext();

  const { data, isPending } = useGetQuery<ContentRes>(
    ["content", content_id],
    `/content/${content_id}`,
 
  );


  const fetchedMovieData = data?.data;
  const movieData = useMemo<ContentItem | undefined>(() => {
    if (selectedMovie?.id === content_id) {
      return selectedMovie;
    }
    return fetchedMovieData;
  }, [selectedMovie, content_id, fetchedMovieData]);

  useEffect(() => {
    if (!movieData) return;

    // Use API data instead of localStorage
    setAddedToFavorite(isInFavorites(movieData?.id));
  }, [movieData?.id, isInFavorites]);

  // Update addedToFavorite when movieList changes
  useEffect(() => {
    if (movieData) {
      setAddedToFavorite(isInFavorites(movieData?.id));
    }
  }, [movieList, movieData?.id, isInFavorites]);

  // Reset modal mute state when modal opens
  useEffect(() => {
    setIsModalMuted(true); // Always start muted when modal opens
  }, []);

  const seasonList =
    (((movieData as any)?.seasons ?? (movieData as any)?.season ?? []) as any[]) || [];
  const hasSeasons = Array.isArray(seasonList) && seasonList.length > 0;
  const selectedSeason = Array.isArray(seasonList)
    ? seasonList.find((season) => season.id === selectedSeasonId) ||
      seasonList[0]
    : undefined;
  const seasonEpisodes = Array.isArray(selectedSeason?.episodes)
    ? [...selectedSeason.episodes].sort((a: any, b: any) => {
        const episodeA =
          typeof a?.episodeNumber === "number"
            ? a.episodeNumber
            : Number.MAX_SAFE_INTEGER;
        const episodeB =
          typeof b?.episodeNumber === "number"
            ? b.episodeNumber
            : Number.MAX_SAFE_INTEGER;
        return episodeA - episodeB;
      })
    : [];

  const formatEpisodeDuration = (episode: any) => {
    if (
      typeof episode?.durationSeconds === "number" &&
      episode.durationSeconds > 0
    ) {
      return `${Math.ceil(episode.durationSeconds / 60)}m`;
    }
    if ((movieData?.durationSeconds || 0) > 0) {
      return `${Math.ceil((movieData?.durationSeconds || 0) / 60)}m`;
    }
    return "";
  };

  if(isPending ) {
    return <GlobalLoading/>
  }

  return (
    <div>
      <HomeHeader />
      <div>
        {!isPending && movieData && (
          <>
            {movieData?.trailerUrls?.[0] ? (
              <div className="relative h-[400px]">
                <div className="absolute inset-0 z-20 bottom-0 bg-gradient-to-t from-[#141414] to-transparent"></div>

                <div className="pointer-events-none overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted={isModalMuted}
                    playsInline
                    src={getSafeMediaUrl(movieData.trailerUrls?.[0])}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out `}
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-primary/60 mix-blend-multiply  " />
                </div>
              </div>
            ) : (
              <div className="h-[400px] relative">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${movieData?.thumbnailUrls?.[0] || THUMBNAIL_FALLBACK})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            )}

            <div className="p-6 md:p-12 relative">
              <div className="">
                <div className="flex flex-row items-center gap-x-4 mb-3">
                  <p
                    className="text-[13px] font-[500] capitalize"
                    style={{ letterSpacing: "8px" }}
                  >
                    {movieData?.type}
                  </p>
                </div>
                <h1
                  className=" text-white 
    font-bold 
    mt-3
    animate-title-entrance
    max-w-[650px]
    text-[clamp(32px,5vw,72px)]
    leading-[1.05]
    break-words
    line-clamp-3
    transition-all duration-700"
                  style={{ lineHeight: "50px" }}
                >
                  {movieData.title}
                </h1>
                <div className="w-[100%] md:w-[60%] pr-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#329AC0] text-[10px] font-semibold">
                      {"New"}
                    </span>

                    <span className="font-[300] text-[10px] text-[#BCBCBC]">
                      {formatEpisodeDuration(movieData?.durationSeconds)}
                    </span>
                    <span className="border-[1.2px] px-2 border-[#808080] rounded-sm text-xs flex text-[10px] flex-row items-center justify-center text-[#BCBCBC]">
                      4K
                    </span>
                  </div>
                  <div className=" flex flex-row items-center -mt-2">
                    <p className="text-[12px]">
                      #2 in{" "}
                      <span className="capitalize">{movieData?.type}</span>{" "}
                      Today
                    </p>
                  </div>
                </div>

                <div className=" mt-3">
                  {hasSeasons ? (
                    <Button
                      fullWidth
                      onClick={() => {
                        router.push(
                          `/watch/${seasonEpisodes[0]?.videoId}?title=${seasonEpisodes?.[0]?.title}&progress=${movieData?.lastPositionSeconds}`,
                        );
                      }}
                      sx={{
                        bgcolor: "#fff",

                        borderRadius: "4px",
                        height: "42px",
                      }}
                      startIcon={<IoIosPlay size={20} className="text-black" />}
                    >
                      <p className=" text-black">Play</p>
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      onClick={() => {
                        router.push(
                          `/watch/${movieData.id}?title=${movieData.title}&progress=${movieData?.lastPositionSeconds}`,
                        );
                      }}
                      sx={{
                        bgcolor: "#fff",

                        borderRadius: "4px",
                        height: "42px",
                      }}
                      startIcon={<IoIosPlay size={20} className="text-black" />}
                    >
                      <p className="font-bold text-black">Play</p>
                    </Button>
                  )}

                  <p className="mt-4 text-[12px] text-[#ccc]">
                    {movieData?.description}
                  </p>

                  <div className="mt-4 flex items-center justify-evenly">
                    <IconButton
                      sx={{
                        height: "42px",
                        width: "42px",
                        border: "2px solid #FFFFFF80",
                      }}
                      onClick={() => {
                        addToFavoriteList(movieData);
                      }}
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
                    </IconButton>

                    <ContentLikes />

                    {/* <div className="pr-2">
                      <IconButton
                        sx={{
                          height: "42px",
                          width: "42px",
                          border: "2px solid #FFFFFF33",
                        }}
                        onClick={() => {
                          setIsModalMuted(!isModalMuted);
                        }}
                      >
                        <RiShareLine />
                      </IconButton>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 h-[20px] bottom-0 bg-gradient-to-b from-[#141414] to-transparent"></div>

              <div className="flex-col md:flex-row flex">
                <div className="mt-4 flex-1 flex flex-col"></div>
              </div>

              {hasSeasons && (
                <div className="mt-10">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-[20px] optima font-semibold leading-tight md:text-[32px]">
                      {`${movieData.title} Episodes. S${selectedSeason?.seasonNumber || 1}`}
                    </h3>

                    <div className="relative w-full md:w-[190px]">
                      <select
                        value={selectedSeason?.id || ""}
                        onChange={(e) => setSelectedSeasonId(e.target.value)}
                        className="h-[48px] w-full appearance-none rounded-sm border border-[#4f4f4f] bg-[#1b1b1b] px-4 pr-10 text-sm text-white outline-none focus:border-[#6EBDE4]"
                      >
                        {seasonList.map((season) => (
                          <option key={season.id} value={season.id}>
                            {season.title || `Season ${season.seasonNumber}`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {seasonEpisodes.map((episode, idx) => {
                      const episodeNumber = episode.episodeNumber || idx + 1;
                      const episodeTitle =
                        episode.title || `Episode ${episodeNumber}`;
                      const episodeDescription =
                        (episode as any)?.description || movieData.description;
                      const episodeThumbnail =
                        (episode as any)?.thumbnailUrl ||
                        movieData?.thumbnailUrls?.[0] ||
                        THUMBNAIL_FALLBACK;

                      return (
                        <button
                          key={
                            episode.id ||
                            `${selectedSeason?.id}-${episode.videoId}-${idx}`
                          }
                          onClick={() => {
                            const watchParams = new URLSearchParams({
                              title: episodeTitle,
                              progress: "0",
                            });
                            router.push(
                              `/watch/${episode.videoId}?${watchParams.toString()}`,
                            );
                          }}
                          className="flex w-full items-center gap-3 bg-[#1a1a1a] p-3 text-left transition-colors hover:bg-[#242424]"
                        >
                          <p className="w-[36px] text-xl font-light text-[#b8b8b8]">
                            {`E${episodeNumber}`}
                          </p>
                          <div className="relative h-[70px] w-[130px] overflow-hidden rounded-sm">
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundImage: `url(${episodeThumbnail || THUMBNAIL_FALLBACK})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                              <IoIosPlay size={28} />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="line-clamp-1 text-base font-semibold">
                                {episodeTitle}
                              </p>
                              <p className="shrink-0 text-sm text-[#c8c8c8]">
                                {formatEpisodeDuration(episode)}
                              </p>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-[#b7b7b7]">
                              {episodeDescription}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <MoreRecommendations videoId={movieData?.id} />

              <div className="mt-8">
                <p className="text-lg">{`About ${movieData.title}`}</p>

                <div className="mt-1">
                  <p className="text-xs mt-1 capitalize">
                    <span className="font-[300] text-[#777777] text-xs capitalize">
                      Category: &nbsp;
                    </span>
                    {movieData.type}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="font-[300] text-[#777777] text-xs">
                      This show is: &nbsp;
                    </span>
                    <span className="capitalize">
                      {movieData?.keywords?.join(", ")}
                    </span>
                  </p>
                  {/* <p className="text-xs mt-1">
                    <span className="font-[300] text-[#777777] text-xs">
                      Maturity rating: &nbsp;
                    </span>
                    {movieData.ageRating}
                  </p> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentOverview;
