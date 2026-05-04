/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { IoIosPlay } from "react-icons/io";
import { BsInfoCircle } from "react-icons/bs";

import { useInView } from "react-intersection-observer";
import { PiSpeakerHighLight, PiSpeakerSlashThin } from "react-icons/pi";
import { Box, Button, IconButton } from "@mui/material";

import Carousel from "../Sliders/Carousel";
import { useVideoContext } from "@/hooks/VideoSoundContext";
import { useBannerData, useContentCategoryData } from "@/hooks/useBannerData";
import { ContentItem } from "@/services/bannerApi";

import { useRouter } from "next/navigation";
import { useMovieContext } from "@/contexts/MovieContext";
import DonationModal from "../Donation/DonationModal";
import { addRecentFlagToVideos } from "@/utils/videoProcessing";
import TileLoader from "../UI/TileLoader";
import { THUMBNAIL_FALLBACK } from "@/utils/helpers";
import useBreakpoint from "@/hooks/useBreakpoints";

// Fallback src

const HomeBanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false); // ✅ New loading state
  const { isMuted, toggleMute } = useVideoContext();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.6 });
  const { setModalOpen, setSelectedMovie } = useMovieContext();
  const route = useRouter();
  const [activeBanner, setActiveBanner] = useState<ContentItem | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [titleAnimationKey, setTitleAnimationKey] = useState(0);
  const [shouldAutoUnmute, setShouldAutoUnmute] = useState(true);
  const [userHasMutedManually, setUserHasMutedManually] = useState(false);
  const [openDonationModal, setOpenDonationModal] = useState(false);

  const handleGOTOWatch = () => {
    if (!activeBanner?.id) return;
    route.push(
      `/watch/${activeBanner.id}?title=${title}&progress=${activeBanner?.lastPositionSeconds || 0}`,
    );
  };

  // Custom mute handler to manage auto-unmute behavior
  const handleMuteToggle = () => {
    setUserHasMutedManually(true); // Mark that user has interacted
    toggleMute();

    // If user is manually muting the video, disable auto-unmute for this video
    if (!isMuted) {
      setShouldAutoUnmute(false); // User is muting - disable auto-unmute
    }
  };

  // Fetch banner data using TanStack Query
  const {
    data: bannerData,
    isLoading: bannerLoading,
    error: bannerError,
  } = useBannerData();
  const {
    data: contentData,
    isLoading: contentLoading,
    error: contentError,
  } = useContentCategoryData();

  // Find Popular Movies category and process videos with recent flags
  const popularMoviesCategory = contentData?.data?.data?.find(
    (c: any) => c.categoryName === "Popular Movies",
  ) as any;

  const popular_content = popularMoviesCategory?.videos
    ? addRecentFlagToVideos(
        popularMoviesCategory.videos,
        contentData?.data?.data || [],
      )
    : [];

  const rawBannerData = bannerData?.data as unknown;
  const bannerList = Array.isArray(rawBannerData)
    ? rawBannerData
    : rawBannerData && typeof rawBannerData === "object"
      ? Object.values(rawBannerData)
      : [];

  useEffect(() => {
    // Auto-unmute only when a new video loads and user hasn't manually interacted
    if (isVideoLoaded && shouldAutoUnmute && isMuted && !userHasMutedManually) {
      // Give a small delay to ensure video is playing smoothly
      setTimeout(() => {
        toggleMute(); // Auto-unmute the new video
      }, 500);
    }
  }, [
    isVideoLoaded,
    shouldAutoUnmute,
    isMuted,
    userHasMutedManually,
    toggleMute,
  ]);

  useEffect(() => {
    if (!bannerList.length) {
      setActiveBanner(null);
      return;
    }
    setActiveBanner(
      (bannerList[currentBannerIndex] as ContentItem) ||
        (bannerList[0] as ContentItem),
    );
    // Trigger title animation whenever banner changes
    setTitleAnimationKey((prev) => prev + 1);
  }, [bannerList, currentBannerIndex]);

  // Use API data or fallback
  const src = activeBanner?.trailerUrls?.[0] || "";
  const title = activeBanner?.title || "FaithStream";
  const description =
    activeBanner?.description === "Video uploaded without metadata"
      ? ""
      : (activeBanner?.description ?? "");
  const category = activeBanner?.type || "TV Shows";
  const rating = activeBanner?.ageRating || "TV-14";
  const thumbnail =
    activeBanner?.thumbnailUrls?.[0] ||
    activeBanner?.thumbnails?.[0] ||
    THUMBNAIL_FALLBACK;

  const setRefs = (node: HTMLVideoElement) => {
    videoRef.current = node;
    inViewRef(node);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Always respect the current mute state
    video.muted = isMuted;

    if (inView) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView, isMuted, isPlaying]);

  // Handle video end to advance to next banner
  const handleVideoEnd = () => {
    if (!bannerList.length) return;
    const nextIndex = (currentBannerIndex + 1) % bannerList.length;
    setCurrentBannerIndex(nextIndex);

    setIsVideoLoaded(false); // Reset video loaded state for smooth transition
    setShouldAutoUnmute(true); // Enable auto-unmute for next video
    setUserHasMutedManually(false); // Reset manual interaction for new video
  };

  const { isMobile } = useBreakpoint();


  if (bannerLoading) return <TileLoader />;

  return (
    <>
      <div style={{height:isMobile ? "100vh" : "auto"}} className=" w-screen video_gradient relative aspect-video ">
        {/* ✅ Video Element */}
        {src && (
          <video
            ref={setRefs}
            src={src}
            playsInline
            muted={isMuted} // Respect the current mute state from context
            className="absolute top-0 left-0 w-full h-full object-cover "
            onCanPlayThrough={() => {
              setTimeout(() => {
                setIsVideoLoaded(true);
              }, 2000);
            }}
            onEnded={handleVideoEnd}
          />
        )}

        {/* ✅ Preview Image (Conditional Rendering) */}
        {!isVideoLoaded && (
          <div
            style={{
              backgroundImage: `url('${thumbnail || THUMBNAIL_FALLBACK}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className={`absolute top-0 left-0 w-full h-full z-10 transition-opacity duration-1000 ease-in-out ${
              isVideoLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
          // <Image
          //   src={
          //     getSafeMediaUrl(thumbnail, THUMBNAIL_FALLBACK) ||
          //     THUMBNAIL_FALLBACK
          //   }
          //   alt="Video Preview"
          //   layout="fill"
          //   objectFit="cover"
          //   className={`absolute top-0 left-0 w-full h-full z-10 transition-opacity duration-1000 ease-in-out ${
          //     isVideoLoaded ? "opacity-0" : "opacity-100"
          //   }`}
          // />
        )}

        {/* Purple Overlay */}
        {/* <div style={{height:isMobile ? "100vh" : "auto"}} className="absolute top-0 left-0 w-screen aspect-video bg-primary/80 mix-blend-multiply z-20 " /> */}

        <div className="absolute bottom-0 left-0 w-screen h-[80%] bg-gradient-to-t from-black to-transparent z-20 " />

        {/* Foreground Content */}

        <div style={{height:isMobile ? "100vh" : "auto"}} className="relative z-30 flex w-full flex-col justify-end overflow-visible aspect-video  ">
          <Box
            sx={{
              width: isMobile ? "100%" : "95vw",
              ml: "auto",
              px: isMobile ? 3 : 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className=" flex-1">
              <div className="flex flex-row items-center gap-x-4">
                <Image
                  src={"/logo/logo_white.svg"}
                  alt="faithstream_logo"
                  width={30}
                  height={30}
                />
                <p
                  className="text-[16px] font-[500] capitalize"
                  style={{ letterSpacing: "8px" }}
                >
                  {category}
                </p>
              </div>

              {/* Show loading state for title and description */}

              <h1
                key={titleAnimationKey}
                className={`
    text-white 
    font-bold 
    mt-4 
    animate-title-entrance
    max-w-[650px]
    text-[clamp(32px,5vw,72px)]
    leading-[1.05]
    break-words
    line-clamp-3
    transition-all duration-700
    ${isVideoLoaded ? "opacity-100" : "opacity-90"}
  `}
              >
                {title}
              </h1>
              <p className="md:w-[40%] w-[80%] mt-5 text-[14px] three-line-ellipsis">
                {description}
              </p>

              {isMobile ? (
                <div className="mt-5  flex-row gap-x-3 items-center flex">
                  <div className="flex-1">
                    <Button
                      sx={{
                        bgcolor: "#fff",
                        color: "#000",

                        borderRadius: "0px",
                        height: "42px",
                        fontSize: "16px",
                      }}
                      fullWidth
                      onClick={handleGOTOWatch}
                      startIcon={<IoIosPlay />}
                    >
                      Play
                    </Button>
                  </div>

                  <IconButton
                    sx={{
                      color: "#fff",
                      width: "40px",
                      height: "40px",
                      borderRadius: "0px",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      route.push(`/browse/content/${activeBanner?.id}`)
                      setSelectedMovie(activeBanner);
                    }}
                    style={{ background: "#6D6D6EB2" }}
                  >
                    <BsInfoCircle />
                  </IconButton>
                  <div className="flex-1">
                    <Button
                      sx={{
                        color: "#fff",

                        borderRadius: "0px",
                        fontWeight: 400,
                        fontSize: "16px",
                      }}
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        setOpenDonationModal(true);
                      }}
                      startIcon={
                        <Image
                          alt="donation"
                          width={20}
                          height={20}
                          src="/icons/donation.svg"
                        />
                      }
                    >
                      GIVE
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex-row gap-x-3 flex">
                  <Button
                    sx={{
                      bgcolor: "#fff",
                      color: "#000",
                      width: "120px",
                      borderRadius: "4px",
                      height: "42px",
                      fontSize: "16px",
                    }}
                    onClick={handleGOTOWatch}
                    startIcon={<IoIosPlay />}
                  >
                    Play
                  </Button>

                  <Button
                    sx={{
                      color: "#fff",
                      width: "160px",
                      borderRadius: "4px",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      setModalOpen(true);
                      setSelectedMovie(activeBanner);
                    }}
                    startIcon={<BsInfoCircle />}
                    style={{ background: "#6D6D6EB2" }}
                  >
                    More Info
                  </Button>
                  <Button
                    sx={{
                      color: "#fff",
                      px: 4,
                      borderRadius: "4px",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                    onClick={() => {
                      setOpenDonationModal(true);
                    }}
                    startIcon={
                      <Image
                        alt="donation"
                        width={20}
                        height={20}
                        src="/icons/donation.svg"
                      />
                    }
                    style={{ background: "#6D6D6EB2" }}
                  >
                    GIVE
                  </Button>
                </div>
              )}
            </div>
            {!isMobile && (
              <div className="flex flex-row items-center gap-x-3">
                <div>
                  <IconButton
                    sx={{ border: "1px solid white" }}
                    onClick={handleMuteToggle}
                  >
                    {!isMuted ? <PiSpeakerHighLight /> : <PiSpeakerSlashThin />}
                  </IconButton>
                </div>
                <div
                  className="h-[42px] w-[110px] border-l-white border-l-2 bg-[#33333399] flex items-center pl-5
"
                >
                  <p>{rating}</p>
                </div>
              </div>
            )}
          </Box>
          <Box
            sx={{
              pt: 5,
            }}
          >
            <Carousel
              isLoading={contentLoading}
              title="Popular Movies"
              items={popular_content ?? []}
            />
          </Box>
        </div>
      </div>

      <DonationModal
        setModal={setOpenDonationModal}
        open={openDonationModal}
        onClose={() => setOpenDonationModal(false)}
      />
    </>
  );
};

export default HomeBanner;
