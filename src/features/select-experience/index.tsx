/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { HomeHeader } from "@/components/header";
import { useGetQuery } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { BannerData, ContentItem } from "@/services/bannerApi";
import ExperienceCard from "@/components/cards/ExperienceCard";
import { useSelectExperienceGroupMutation } from "@/hooks/useSelectExperienceGroupMutation";
import type { ExperienceGroupStatusResponse } from "@/services/experienceGroup";
import {
  EXPERIENCE_GROUP_STATUS_QUERY_KEY,
  experienceGroupDisplayName,
} from "@/services/experienceGroup";
import { Button, Skeleton } from "@mui/material";
import { GoArrowRight } from "react-icons/go";
import { useContentCategoryData } from "@/hooks/useBannerData";
import { processCategoriesWithRecentFlags } from "@/utils/videoProcessing";
import Carousel from "@/components/Sliders/Carousel";
import Loader from "@/components/UI/Loader";

interface ContentRes {
  data: {
    data: { videos: ContentItem[]; banner: BannerData }[];
  };
}

interface AvailableExperiencesResponse {
  data: {
    id: string;
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
    contentTypes: { bannerImage: string }[];
  }[];
}

interface TrailerItem {
  src: string;
}

const SelectExperience = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { mutate: submitExperienceGroup, isPending: isSubmittingExperience } =
    useSelectExperienceGroupMutation();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const hasHydratedSelectionFromApi = useRef(false);

  const { data } = useGetQuery<ContentRes>(
    ["landing_movies"],
    "content/categories-landing-page?limit=10",
  );
  const videoRefs = useRef<[HTMLVideoElement | null, HTMLVideoElement | null]>([
    null,
    null,
  ]);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playlist, setPlaylist] = useState<TrailerItem[]>([]);
  const [visibleSlot, setVisibleSlot] = useState<0 | 1>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slotSources, setSlotSources] = useState<[string, string]>(["", ""]);

  const { data: experienceStatus, isSuccess: experienceStatusReady } =
    useGetQuery<ExperienceGroupStatusResponse>(
      [...EXPERIENCE_GROUP_STATUS_QUERY_KEY],
      "/users/me/experience-group-status",
      isAuthenticated,
    );

  const { data: availableExperiences, isPending: gettingAvailableExperiences } =
    useGetQuery<AvailableExperiencesResponse>(
      ["available-experiences"],
      "/content/experience-groups",
      isAuthenticated,
    );

  useEffect(() => {
    if (hasHydratedSelectionFromApi.current) return;
    if (!experienceStatusReady || !experienceStatus?.data?.selected) return;
    const gid = experienceStatus.data.groupId;
    if (gid) {
      setSelectedGroupId(gid);
      hasHydratedSelectionFromApi.current = true;
    }
  }, [experienceStatus?.data, experienceStatusReady]);

  useEffect(() => {
    const categories = data?.data?.data ?? [];
    const trailerPool = categories.flatMap((category) =>
      category.videos.flatMap((video) =>
        (video.trailerUrls ?? []).filter(Boolean).map((src) => ({
          src,
        })),
      ),
    );

    const uniqueTrailers = trailerPool.filter(
      (trailer, index, list) =>
        list.findIndex((item) => item.src === trailer.src) === index,
    );

    const shuffledTrailers = [...uniqueTrailers];
    for (let index = shuffledTrailers.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledTrailers[index], shuffledTrailers[randomIndex]] = [
        shuffledTrailers[randomIndex],
        shuffledTrailers[index],
      ];
    }

    setPlaylist(shuffledTrailers);
    setVisibleSlot(0);
    setCurrentIndex(0);
    setSlotSources([
      shuffledTrailers[0]?.src ?? "",
      shuffledTrailers[1]?.src ?? "",
    ]);
  }, [data]);

  useEffect(() => {
    if (!playlist.length) return;

    const hiddenSlot: 0 | 1 = visibleSlot === 0 ? 1 : 0;
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSrc = playlist[nextIndex]?.src ?? "";

    if (!nextSrc) return;

    setSlotSources((currentSources) => {
      if (currentSources[hiddenSlot] === nextSrc) {
        return currentSources;
      }

      const updatedSources: [string, string] = [...currentSources] as [
        string,
        string,
      ];
      updatedSources[hiddenSlot] = nextSrc;
      return updatedSources;
    });
  }, [currentIndex, playlist, visibleSlot]);

  useEffect(() => {
    const activeVideo = videoRefs.current[visibleSlot];
    if (!activeVideo || !slotSources[visibleSlot]) return;

    activeVideo.currentTime = 0;
    activeVideo.play().catch(() => {});
  }, [slotSources, visibleSlot]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const handleVideoReady = (slot: 0 | 1) => {
    if (slot === visibleSlot) {
      videoRefs.current[slot]?.play().catch(() => {});
    }
  };

  const handleVideoEnd = (slot: 0 | 1) => {
    if (slot !== visibleSlot || !playlist.length) return;
    if (playlist.length === 1) {
      const video = videoRefs.current[slot];
      if (!video) return;
      video.currentTime = 0;
      video.play().catch(() => {});
      return;
    }

    const nextSlot: 0 | 1 = slot === 0 ? 1 : 0;
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextVideo = videoRefs.current[nextSlot];
    const currentVideo = videoRefs.current[slot];

    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }

    setVisibleSlot(nextSlot);
    setCurrentIndex(nextIndex);

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    fadeTimeoutRef.current = setTimeout(() => {
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      }
    }, 700);
  };

  const selectedExperienceName =
    availableExperiences?.data.find((e) => e.id === selectedGroupId)?.name ??
    null;

  const hasExistingSelection =
    experienceStatusReady && experienceStatus?.data?.selected === true;

  const currentExperienceDisplayName =
    experienceGroupDisplayName(
      experienceStatus?.data?.experienceGroup ?? null,
    ) ||
    (experienceStatus?.data?.groupId
      ? availableExperiences?.data.find(
          (e) => e.id === experienceStatus.data.groupId,
        )?.name
      : null) ||
    null;

  const pageTitle = hasExistingSelection
    ? "Change your experience"
    : "Choose your experience";

  const handleContinue = () => {
    if (!selectedGroupId || isSubmittingExperience) return;
    submitExperienceGroup(
      { groupId: selectedGroupId },
      { onSuccess: () => router.push("/browse") },
    );
  };
  const {
    data: contentCategoryData,
    isLoading: contentCategoryLoading,
    error: contentCategoryError,
  } = useContentCategoryData();

  // Process categories and add isRecent flags to all videos
  const processedCategories = processCategoriesWithRecentFlags(
    contentCategoryData?.data?.data || [],
  );

  const Top10 = processedCategories?.filter(
    (c: any) => c.categoryName === "TOP 10 in Nigeria",
  );

  console.log("other_categories", Top10);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-white">
      <HomeHeader hideNav={true} />
      {
        isSubmittingExperience && <Loader label="Updating experience..."/>
      }
      {/* Fixed full-viewport backdrop so main content can scroll on small screens */}
      <div
        className="pointer-events-none fixed inset-0 z-0 min-h-dvh"
        aria-hidden="true"
      >
        {slotSources.map((src, index) => {
          const slot = index as 0 | 1;

          if (!src) return null;

          return (
            <video
              key={`${slot}-${src}`}
              ref={(element) => {
                videoRefs.current[slot] = element;
              }}
              className={`absolute inset-0 h-full min-h-dvh w-full object-cover transition-opacity duration-700 ease-in-out ${
                visibleSlot === slot ? "opacity-100" : "opacity-0"
              }`}
              autoPlay={visibleSlot === slot}
              muted
              playsInline
              preload="auto"
              onCanPlay={() => handleVideoReady(slot)}
              onEnded={() => handleVideoEnd(slot)}
            >
              <source src={src} type="video/mp4" />
            </video>
          );
        })}

        <div className="absolute inset-0 min-h-dvh bg-black/55" />
        <div className="absolute inset-0 min-h-dvh bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_42%)]" />
        <div className="absolute inset-0 min-h-dvh bg-gradient-to-b from-black/70 via-black/35 to-black" />
      </div>

      <div className="relative z-10 w-full px-5 pb-20 pt-32 md:flex md:min-h-dvh md:items-center md:justify-center md:px-10 md:pb-16 md:pt-28">
        <div className="w-full max-w-[1240px]">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-center text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem] md:text-[3.6rem]">
              {pageTitle}
            </h1>
            {hasExistingSelection ? (
              <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#DCDCDC] sm:text-base md:mt-4 md:text-[1.06rem]">
                {currentExperienceDisplayName ? (
                  <>
                    You&apos;re currently on{" "}
                    <span className="font-medium text-white">
                      {currentExperienceDisplayName}
                    </span>
                    {/* . Select another card to switch, then continue — or keep your
                    current choice and return to browse. */}
                  </>
                ) : (
                  <>
                    Select an experience below, then continue to update your
                    choice or return to browse.
                  </>
                )}
              </p>
            ) : (
              <p className="mx-auto mt-3 text-center text-sm leading-relaxed text-[#DCDCDC] sm:text-base md:mt-4 md:text-[1.06rem]">
                FaithStream is a daily faith companion designed to support the
                rhythm of
                <br className="hidden md:block" /> everyday spiritual life.
              </p>
            )}
          </div>

          <div className="mx-auto mt-9 grid max-w-[820px] grid-cols-1 gap-7 sm:mt-10 sm:gap-8 md:mt-12 md:max-w-none md:grid-cols-3 md:gap-11">
            {gettingAvailableExperiences ? (
              <>
                {[...Array(3)].map((_, idx) => (
                  <Skeleton
                    animation="wave"
                    sx={{ width: "100%", height: "200px", borderRadius: "8px" }}
                    key={idx}
                    variant="rectangular"
                  />
                ))}
              </>
            ) : (
              availableExperiences?.data.map((experience, idx) => (
                <ExperienceCard
                onClick={handleContinue}
                  key={experience.id}
                  description={experience.description}
                  entranceIndex={idx}
                  groupId={experience.id}
                  imageUrl={experience.icon ?? ""}
                  isSelected={selectedGroupId === experience.id}
                  title={experience.name}
                  onSelect={setSelectedGroupId}
                />
              ))
            )}
          </div>

          {/* <div className="mt-20 flex justify-center">
            <Button
              loading={isSubmittingExperience}
              loadingPosition="end"
              disabled={
                gettingAvailableExperiences ||
                !selectedGroupId ||
                isSubmittingExperience
              }
              endIcon={<GoArrowRight className="text-[12px]" />}
              variant="contained"
              sx={{ height: "56px", borderRadius: "8px", minWidth: "200px" }}
              
            >
              {selectedExperienceName
                ? `Continue with ${selectedExperienceName}`
                : "Continue"}
            </Button>
          </div> */}

          <div className="mb-5">
             {Top10
              ?.filter((cat: any) => cat?.videos?.length > 0)
              ?.map((cat: any, idx: number) => {
                const isTop10 = cat?.categoryName
                  ?.toLowerCase()
                  .includes("top");
                const IsContinue = cat?.categoryName === "Continue Watching";

                return (
                  <div className="mt-15" key={idx}>
                    <Carousel
                      title={"We Think You\'ll Love These:"}
                      isTop10={false}
                      items={cat?.videos ?? []}
                      watching={IsContinue}
                      isLoading={contentCategoryLoading}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>

  );
};

export default SelectExperience;
