"use client";

import React, { useEffect, useRef, useState } from "react";

import { HomeHeader } from "@/components/header";
import { useGetQuery } from "@/hooks/useQuery";
import { BannerData, ContentItem } from "@/services/bannerApi";
import ExperienceCard from "@/components/cards/ExperienceCard";

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
    <div className="relative min-h-screen overflow-hidden bg-black">
      <HomeHeader hideNav={true} />
      <div className="relative h-screen flex justify-center items-center">
        {slotSources.map((src, index) => {
          const slot = index as 0 | 1;

          if (!src) return null;

          return (
            <video
              key={`${slot}-${src}`}
              ref={(element) => {
                videoRefs.current[slot] = element;
              }}
              className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-700 ease-in-out ${
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

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        <div className="absolute inset-0 flex items-center justify-center px-4 py-24 md:px-10">
          <div className="w-full max-w-7xl">
            <div>
              <h1 className="text-center text-[2.2rem] font-semibold md:text-[3.5rem]">
                Choose your experience
              </h1>
              <p className="mt-3 text-center text-[#DCDCDC]">
              FaithStream is a daily faith companion designed to support the
              rhythm of
                <br className="hidden md:block" /> everyday spiritual life.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              <ExperienceCard
                description="When you need a moment with God, this is where you begin."
                title="Encounter"
                imageUrl="/images/movie6.png"
              />
              <ExperienceCard
                description="Faith grows through learning, reflection, and daily spiritual practice."
                title="Growth"
                imageUrl="/images/movie7.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectExperience;
