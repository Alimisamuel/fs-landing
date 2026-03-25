/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { HomeHeader } from "../header";
import Image from "next/image";

import { IoIosArrowDown, IoIosPlay } from "react-icons/io";
import { BsInfoCircle } from "react-icons/bs";

import { useInView } from "react-intersection-observer";
import { PiSpeakerHighLight, PiSpeakerSlashThin } from "react-icons/pi";
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";

import Carousel from "../Sliders/Carousel";

import { useVideoContext } from "@/hooks/VideoSoundContext";
import { useBannerData, useContentCategoryData } from "@/hooks/useBannerData";

import { ContentItem } from "@/services/bannerApi";
import GlobalLoading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useMovieContext } from "@/contexts/MovieContext";
import Container from "../UI/Container";
import { useContentCategories } from "@/hooks/useContentCategories";
import { processCategoriesWithRecentFlags } from "@/utils/videoProcessing";
import TileLoader from "../UI/TileLoader";
import { getSafeMediaUrl, THUMBNAIL_FALLBACK } from "@/utils/helpers";
import useBreakpoint from "@/hooks/useBreakpoints";
import DonationModal from "../Donation/DonationModal";

const CategoryBanner = ({ category }: { category: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false); // ✅ New loading state
  const { isMuted, toggleMute } = useVideoContext();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.6 });
  const { setModalOpen, setSelectedMovie } = useMovieContext();
  const [activeBanner, setActiveBanner] = useState<ContentItem | null>(null);
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const route = useRouter();

  const { selectedCategory } = useContentCategories(category);

  const handleGOTOWatch = () => {
    if (!activeBanner?.id) return;
    route.push(
      `/watch/${activeBanner.id}?title=${title}&progress=${activeBanner?.lastPositionSeconds || 0}`,
    );
  };

  // Fetch banner data using TanStack Query
  const {
    data: bannerData,
    isLoading: bannerLoading,
    error: bannerError,
  } = useBannerData(selectedCategory?.id);
  const {
    data: contentCategoryData,
    isFetching: contentCategoryLoading,
    error: contentCategoryError,
  } = useContentCategoryData(10, selectedCategory?.id || "");

  const processedCategories = processCategoriesWithRecentFlags(
    contentCategoryData?.data?.data || [],
  );

  const other_categories = processedCategories?.filter(
    (c: any) => c.categoryName !== "Popular Movies",
  );

  const firstCategory = other_categories?.[0] || null;

  useEffect(() => {
    if (isVideoLoaded) {
      toggleMute();
    }
  }, [isVideoLoaded]);

  useEffect(() => {
    const rawBannerData = bannerData?.data as unknown;
    const normalizedBannerList = Array.isArray(rawBannerData)
      ? rawBannerData
      : rawBannerData && typeof rawBannerData === "object"
        ? Object.values(rawBannerData)
        : [];

    setActiveBanner((normalizedBannerList?.[0] as ContentItem) || null);
  }, [bannerData]);

  // Use API data or fallback
  const src = activeBanner?.trailerUrls?.[0] || "";
  const title = activeBanner?.title || "FaithStream";
  const description =
    activeBanner?.description === "Video uploaded without metadata"
      ? ""
      : (activeBanner?.description ?? "");

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

    video.muted = isMuted;

    if (inView) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView, isMuted, isPlaying]);

  const { isMobile } = useBreakpoint();

  if (bannerLoading) return <TileLoader />;

  return (
    <>
      <div className=" w-screen video_gradient relative aspect-video h-[70vh] md:h-auto ">
        {/* ✅ Video Element */}
        {src && (
          <video
            ref={setRefs}
            src={getSafeMediaUrl(src)}
            loop
            playsInline
            muted={isMuted}
            className="absolute top-0 left-0 w-full h-full object-cover "
            onCanPlayThrough={() => {
              setTimeout(() => {
                setIsVideoLoaded(true);
              }, 2000);
            }}
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
        )}

        {/* Purple Overlay */}
        <div className="absolute top-0 left-0 w-screen aspect-video h-[70vh] md:h-auto bg-primary/80 mix-blend-multiply z-20 " />

        <div className="absolute bottom-0 left-0 w-screen h-1/2 bg-gradient-to-t from-black to-transparent z-20 " />

        {/* Foreground Content */}
        <div className="absolute  z-50 left-0 w-screen h-1/2 mt-15">
          <Container>
            <div className="pt-10 flex items-center gap-x-4 px-5 md:px-0">
              <p className="text-[40px] text-white font-bold capitalize ">
                {category}
              </p>
            </div>
          </Container>
        </div>

        <div className="relative z-30 flex w-full flex-col justify-end overflow-visible aspect-video h-[70vh] md:h-auto ">
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
            <div className="flex-1">
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
                  {activeBanner?.type || ""}
                </p>
              </div>

              {/* Show loading state for title and description */}

              <h1
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
                      route.push(`/browse/content/${activeBanner?.id}`);
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
                    onClick={toggleMute}
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

          {firstCategory?.video?.length > 0 ? (
            <Box
              sx={{
                pt: 5,
              }}
            >
              <Carousel
                title={firstCategory?.categoryName}
                items={firstCategory?.video || []}
                isLoading={contentCategoryLoading}
              />
            </Box>
          ) : (
            <div className="mt-20" />
          )}
        </div>
        <DonationModal
          setModal={setOpenDonationModal}
          open={openDonationModal}
          onClose={() => setOpenDonationModal(false)}
        />
      </div>
    </>
  );
};

export default CategoryBanner;
