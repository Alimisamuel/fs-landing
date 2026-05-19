/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Check, ChevronDown, Plus, ThumbsUp, X } from "lucide-react";
import React, {
  FC,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState,
} from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { useSpring, animated } from "@react-spring/web";

import { useRouter } from "next/navigation";

import SimilarMoviesCard from "./SimilarMovies";
import Image from "next/image";

import { IoIosPlay } from "react-icons/io";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { PiSpeakerHighLight, PiSpeakerSlashThin } from "react-icons/pi";

import { useUtilsContext } from "@/contexts/UtilsContext";
import { ContentItem } from "@/services/bannerApi";
import { useVideoContext } from "@/hooks/VideoSoundContext";
import ContentLikes from "../cards/components/ContentLikes";
import { useContentData, useContentCategoryData } from "@/hooks/useBannerData";
import { addRecentFlagToVideos } from "@/utils/videoProcessing";
import MoreRecommendations from "./MoreRecommendations";
import { getSafeMediaUrl, THUMBNAIL_FALLBACK } from "@/utils/helpers";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieData: ContentItem;
}

interface FadeProps {
  children: ReactElement<{ onClick?: MouseEventHandler<HTMLElement> }>;
  in?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: Record<string, unknown>; // or a defined type if you know the structure
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
  function Fade(props, ref) {
    const { children, in: open, onClick, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          const dummyNode = document.createElement("div");
          onEnter(dummyNode, true);
        }
      },
      onRest: () => {
        if (!open && onExited) {
          const dummyNode = document.createElement("div");
          onExited(dummyNode, true);
        }
      },
    });

    return (
      <animated.div ref={ref} style={style} {...other}>
        {React.cloneElement(children, { onClick })}
      </animated.div>
    );
  },
);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xl: "60vw", lg: "70vw", md: "80vw", xs:'100vw' },
  bgcolor: "none",
  p: 4,
  height: "100vh",
  pt: 10,
  overflow: "scroll",
};

const MoreInfoModal: FC<ModalProps> = ({ isOpen, onClose, movieData }) => {
  const {
    addToFavoriteList,
    randomDuration,
    isInFavorites,
    movieList,
    isItemMutating,
  } = useUtilsContext();

  // Use local mute state for the modal video to avoid conflicts with global context
  const [isModalMuted, setIsModalMuted] = useState(true);

  const [addedToFavorite, setAddedToFavorite] = useState<boolean>(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (!isOpen || !movieData) return;

    // Use API data instead of localStorage
    setAddedToFavorite(isInFavorites(movieData.id));
  }, [isOpen, movieData?.id, isInFavorites]);

  // Update addedToFavorite when movieList changes
  useEffect(() => {
    if (movieData) {
      setAddedToFavorite(isInFavorites(movieData.id));
    }
  }, [movieList, movieData?.id, isInFavorites]);

  // Reset modal mute state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsModalMuted(true); // Always start muted when modal opens
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !movieData) return;
    const seasonList = ((movieData as ContentItem)?.seasons ?? (movieData as ContentItem)?.seasons ?? []) as any[];
    const firstSeasonId = seasonList?.[0]?.id || "";
    setSelectedSeasonId(firstSeasonId);
  }, [isOpen, movieData?.id, (movieData as ContentItem)?.seasons, (movieData as ContentItem)?.seasons]);


  // Process videos with recent flags and filter out current movie



  const seasonList = ((movieData as ContentItem)?.seasons ?? (movieData as ContentItem)?.seasons ?? []) as any[];
  const hasSeasons = Array.isArray(seasonList) && seasonList.length > 0;
  const selectedSeason =
  Array.isArray(seasonList)
    ? seasonList.find((season) => season.id === selectedSeasonId) ||
      seasonList[0]
    : undefined;
  const seasonEpisodes = Array.isArray(selectedSeason?.episodes)
    ? [...selectedSeason.episodes].sort((a: any, b: any) => {
        const episodeA = typeof a?.episodeNumber === "number" ? a.episodeNumber : Number.MAX_SAFE_INTEGER;
        const episodeB = typeof b?.episodeNumber === "number" ? b.episodeNumber : Number.MAX_SAFE_INTEGER;
        return episodeA - episodeB;
      })
    : [];

  const formatEpisodeDuration = (episode: any) => {
    if (typeof episode?.durationSeconds === "number" && episode.durationSeconds > 0) {
      return `${Math.ceil(episode.durationSeconds / 60)}m`;
    }
    if (movieData?.durationSeconds > 0) {
      return `${Math.ceil(movieData.durationSeconds / 60)}m`;
    }
    return "";
  };

  if (!isOpen) return null;

console.log(movieData)
  return (
    <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {},
      }}
    >
      <Fade in={isOpen}>
        <Box sx={style} className="hide_scrollbar">
          <div
            className="h-auto w-[100%] bg-[#141414] text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute z-50 top-4 right-6 text-white bg-[#181818] p-3 rounded-full"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            {movieData ? (
              <div className="relative h-[400px]">
                <div className="absolute inset-0 z-20 bottom-0 bg-gradient-to-t from-[#141414] to-transparent"></div>

                <div className="absolute z-50 left-6 md:left-12 bottom-2 w-[90%]">
                  <div className="flex flex-row items-center gap-x-4 mb-3">
                    <Image
                      src={"/logo/logo_white.svg"}
                      alt="faithstream_logo"
                      width={25}
                      height={25}
                    />
                    <p
                      className="text-[16px] font-[500] capitalize"
                      style={{ letterSpacing: "8px" }}
                    >
                      {movieData?.type}
                    </p>
                  </div>
                  <h1
                    className="text-white text-[50px] mb-4 font-bold w-[70%] mt-4"
                    style={{ lineHeight: "50px" }}
                  >
                    {movieData.title}
                  </h1>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
                     {
                      hasSeasons ? (
                         <Button
                        onClick={() => {
                          router.push(
                            `/watch/${seasonEpisodes[0]?.videoId}?title=${seasonEpisodes?.[0]?.title}&progress=${movieData?.lastPositionSeconds}`,
                          );
                          onClose();
                        }}
                        sx={{
                          bgcolor: "#fff",
                          width: "112px",
                          borderRadius: "4px",
                          height: "42px",
                        }}
                        startIcon={
                          <IoIosPlay size={20} className="text-black" />
                        }
                      >
                        <p className="lg:block hidden text-black">Play</p>
                      </Button>
                      ):(
                         <Button
                        onClick={() => {
                          router.push(
                            `/watch/${movieData.id}?title=${movieData.title}&progress=${movieData?.lastPositionSeconds}`,
                          );
                          onClose();
                        }}
                        sx={{
                          bgcolor: "#fff",
                          width: "112px",
                          borderRadius: "4px",
                          height: "42px",
                        }}
                        startIcon={
                          <IoIosPlay size={20} className="text-black" />
                        }
                      >
                        <p className="lg:block hidden text-black">Play</p>
                      </Button>
                      )
                     }

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
                    </div>

                    <div className="pr-2">
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
                        {!isModalMuted ? (
                          <PiSpeakerHighLight />
                        ) : (
                          <PiSpeakerSlashThin />
                        )}
                      </IconButton>
                    </div>
                  </div>
                </div>

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
              <div className="p-6 md:p-12 relative">
                <p>Video Not Available...</p>
              </div>
            )}

            <div className="p-6 md:p-12 relative">
              <div className="absolute inset-0 h-[20px] bottom-0 bg-gradient-to-b from-[#141414] to-transparent"></div>

              <div className="flex-col md:flex-row flex">
                <div className="w-[100%] md:w-[60%] pr-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#329AC0] font-semibold">
                      {"New"}
                    </span>
                    {/* <span className="border-[1px] px-2 border-[#808080] rounded-sm text-xs flex flex-row items-center justify-center text-[#BCBCBC]">
                      {movieDetails?.adult ? "18+" : "13+"}
                    </span> */}
                    <span className="font-[300] text-[#BCBCBC]">
                      {formatEpisodeDuration(movieData?.durationSeconds)}
                    </span>
                    <span className="border-[1.2px] px-2 border-[#808080] rounded-sm text-xs flex flex-row items-center justify-center text-[#BCBCBC]">
                      4K
                    </span>
                  </div>
                  <div className=" flex flex-row items-center gap-x-2">
                    <div className="bg-[#701F63] flex flex-col items-center justify-center p-1 rounded-[8px] px-2">
                      <p className="text-[10px] font-[500]">TOP </p>
                      <p className="font-[900] text-[10px]">10</p>
                    </div>
                    <p className="text-lg">
                      #2 in{" "}
                      <span className="capitalize">{movieData?.type}</span>{" "}
                      Today
                    </p>
                  </div>
                  <p className="mt-3">{movieData?.description}</p>
                </div>
                <div className="mt-4 flex-1 flex flex-col">
                  {/* <p>
                    <span className="font-[300] text-[#777777]">
                      Cast: &nbsp;
                    </span>
                    {"Kento Kaku, Yosuke Eguchi, Tae Kimura, more"}
                  </p> */}
             {/* {
              movieData?.keywords && (
                     <p className="mt-4">
                    <span className="font-[300] text-[#777777]">
                      Genres: &nbsp;
                    </span>
                    <span className="capitalize">
                      {movieData?.keywords?.join(" • ")}
                    </span>
                  </p>
              )
             } */}
                </div>
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
                      const episodeTitle = episode.title || `Episode ${episodeNumber}`;
                      const episodeDescription =
                        (episode as any)?.description || movieData.description;
                      const episodeThumbnail =
                        (episode as any)?.thumbnailUrl ||
                        movieData?.thumbnailUrls?.[0] ||
                        THUMBNAIL_FALLBACK;

                      return (
                        <button
                          key={episode.id || `${selectedSeason?.id}-${episode.videoId}-${idx}`}
                          onClick={() => {
                            const watchParams = new URLSearchParams({
                              title: episodeTitle,
                              progress: "0",
                            });
                            router.push(
                              `/watch/${episode.videoId}?${watchParams.toString()}`,
                            );
                            onClose();
                          }}
                          className="flex w-full items-center gap-3 bg-[#1a1a1a] p-3 text-left transition-colors hover:bg-[#242424]"
                        >
                          <p className="w-[36px] text-xl font-light text-[#b8b8b8]">
                            {`E${episodeNumber}`}
                          </p>
                          <div className="relative h-[70px] w-[130px] overflow-hidden rounded-sm">
                            <div
                            className="w-full h-full"
                            style={{backgroundImage:`url(${episodeThumbnail || THUMBNAIL_FALLBACK})`, backgroundSize:'cover', backgroundPosition:'center'}} 
                              
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
                  {/* <p className="text-xs">
                    <span className="font-[300] text-[#777777] text-xs">
                      Director: &nbsp;
                    </span>
                    {"Kento Kaku, Yosuke Eguchi, Tae Kimura, more"}
                  </p> */}
                  {/* <p className="text-xs mt-1">
                    <span className="font-[300] text-[#777777] text-xs">
                      Cast: &nbsp;
                    </span>
                    {
                      "ento Kaku, Yosuke Eguchi, Tae Kimura, Kengo Kora, Aju Makita, Nobuko Miyamoto, Tomorowo Taguchi, Riho Yoshioka, Tokio Emoto, Kyusaku Shimada, Pierre Taki, Mariko Tsutsui, Tenta Banka, Takayuki Yamada"
                    }
                  </p> */}
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
                  <p className="text-xs mt-1">
                    {/* <span className="font-[300] text-[#777777] text-xs">
                      Maturity rating: &nbsp;
                    </span> */}
                    {/* {movieData.ageRating} */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MoreInfoModal;
