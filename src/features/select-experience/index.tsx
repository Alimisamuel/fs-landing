/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { HomeHeader } from "@/components/header";
import { useGetQuery } from "@/hooks/useQuery";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/slices/authSlice";
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
import { playSelectionFeedback } from "@/utils/selectionFeedback";
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

const EXIT_SCREEN_FADE_MS = 2000;

const SelectExperience = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
   const user = useAppSelector(selectCurrentUser);
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
  const exitFadeStartedAtRef = useRef<number | null>(null);

  const [isExitFading, setIsExitFading] = useState(false);

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
    ? "What do you need today"
    : "What do you need today";

  const handleContinue = (groupId?: string) => {
    const targetGroupId = groupId ?? selectedGroupId;
    if (!targetGroupId || isSubmittingExperience) return;
    setSelectedGroupId(targetGroupId);
    exitFadeStartedAtRef.current = Date.now();
    setIsExitFading(true);

    submitExperienceGroup(
      { groupId: targetGroupId },
      {
        onSuccess: () => {
          const startedAt = exitFadeStartedAtRef.current ?? Date.now();
          const elapsed = Date.now() - startedAt;
          const waitMs = Math.max(0, EXIT_SCREEN_FADE_MS - elapsed);
          setTimeout(() => {
            router.push("/browse");
          }, waitMs);
        },
        onError: () => {
          setIsExitFading(false);
          exitFadeStartedAtRef.current = null;
        },
      },
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
    (c: any) => c?.categoryName === "TOP 10 in Nigeria",
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
    <div className="absolute inset-0 min-h-dvh bg-black/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full px-5 pb-20 pt-32 md:flex md:min-h-dvh md:items-center md:justify-center md:px-10 md:pb-16 md:pt-28">
        <div className="w-full max-w-[1240px]">
          <header className="mx-auto max-w-3xl text-center">
            <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6">
              <p
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:text-[11px]"
                id="select-experience-step"
              >
                Step 1 of 1
              </p>

              {hasExistingSelection ? (
                <p className="text-base font-medium leading-snug text-neutral-200 sm:text-lg">
                  Welcome back
                  {user?.firstName ? (
                    <>
                      ,{" "}
                      <span className="font-semibold text-white">
                        {user.firstName}
                      </span>
                    </>
                  ) : null}
                </p>
              ) : null}

              <div className="flex w-full flex-col items-center gap-3 sm:gap-4">
                <h1 className="text-pretty text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.4rem] sm:leading-[1.06] md:text-[3.25rem]">
                  {pageTitle}
                </h1>

                {hasExistingSelection ? (
                  <p className="mx-auto max-w-xl text-pretty text-sm leading-relaxed text-neutral-300 sm:text-base md:text-[1.0625rem]">
                    {currentExperienceDisplayName ? (
                      <>
                        You&apos;re currently on{" "}
                        <span className="font-medium text-white">
                          {currentExperienceDisplayName}
                        </span>
                      </>
                    ) : (
                      "Choose an experience to begin."
                    )}
                  </p>
                ) : (
                  <p className="mx-auto max-w-lg text-pretty text-sm leading-relaxed text-neutral-300 sm:max-w-xl sm:text-base md:text-[1.0625rem]">
                    FaithStream is a daily faith companion designed to support the
                    rhythm of everyday spiritual life.
                  </p>
                )}
              </div>
            </div>
          </header>

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
                  hasActiveSelection={Boolean(selectedGroupId)}
                  imageUrl={experience.icon ?? ""}
                  isSelected={selectedGroupId === experience.id}
                  title={experience.name}
                  onSelectionFeedback={playSelectionFeedback}
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

      <div
        aria-hidden="true"
        style={{ transitionDuration: `${EXIT_SCREEN_FADE_MS}ms` }}
        className={`fixed inset-0 z-[1400] bg-black transition-opacity ease-out ${
          isExitFading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
    </div>

  );
};

export default SelectExperience;
