"use client";

import React, { useEffect, useRef, useState } from "react";

import { HomeHeader } from "@/components/header";
import { useGetQuery } from "@/hooks/useQuery";
import { BannerData, ContentItem } from "@/services/bannerApi";
import ExperienceCard from "@/components/cards/ExperienceCard";
import Link from "next/link";

interface ContentRes {
  data: {
    data: { videos: ContentItem[]; banner: BannerData }[];
  };
}

interface TrailerItem {
  src: string;
}

const SelectExperience = () => {
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

  const {data:status} = useGetQuery([""], `/users/me/experience-group-status`)

  console.log(status, "STATUS");

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

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-white">
      <HomeHeader hideNav={true} />
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
              Choose your experience
            </h1>
            <p className="mx-auto mt-3 text-center text-sm leading-relaxed text-[#DCDCDC] sm:text-base md:mt-4 md:text-[1.06rem]">
              FaithStream is a daily faith companion designed to support the
              rhythm of
              <br className="hidden md:block" /> everyday spiritual life.
            </p>
          </div>

          <div className="mx-auto mt-9 grid max-w-[820px] grid-cols-1 gap-7 sm:mt-10 sm:gap-8 md:mt-12 md:max-w-none md:grid-cols-3 md:gap-11">
            <Link href="/browse">
            <ExperienceCard
              description="When you need a moment with God, this is where you begin."
              entranceIndex={0}
              title="Encounter"
              imageUrl="/images/movie6.png"
            />
            </Link>
            <Link href="/browse">
            <ExperienceCard
              description="Faith grows through learning, reflection, and daily spiritual practice."
              entranceIndex={1}
              title="Growth"
              imageUrl="/images/movie7.png"
            />
            </Link>
            <Link href="/browse">
            <ExperienceCard
              description="FaithStream brings you films and series rooted in faith, hope, redemption, and purpose."
              entranceIndex={2}
              title="Entertainment "
              imageUrl="/images/movie5.png"
            />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectExperience;
