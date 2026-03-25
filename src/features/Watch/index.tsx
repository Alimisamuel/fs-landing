"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import FsVideoPlayer from "@/components/players/FsVideoPlayer";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { useParams, useSearchParams } from 'next/navigation';
import { useGetQuery } from '@/hooks/useQuery';
import { ContentItem } from '@/services/bannerApi';

type ExtendedVariants = {
  [key: string]: {
    opacity?: number;
    scale?: number;
    filter?: string;
    y?: number;
    transition?: any;
  };
};

interface ContentRes {
  
    data:ContentItem
  
}

const PROGRESS_UPDATE_DELAY_MS = 1000;

const WatchMovie = () => {
  const [duration, setDuration] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
   const { id } = useParams<{ id: string }>();




   const params = useSearchParams();

   const {data, isPending} = useGetQuery<ContentRes>(["content", id], `/content/${id}`)

   const  content_details = data?.data

   const title = content_details?.title || "Now Playing";
   const description = content_details?.description || "Press play to continue watching.";
   const progressParam = params.get("progress");
   const progressSeconds = Number(progressParam);
   const initialProgressSeconds =
     Number.isFinite(progressSeconds) && progressSeconds >= 0 ? progressSeconds : 0;
   const lastSyncedProgressRef = useRef<number>(initialProgressSeconds);
   const progressUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(() => {
    lastSyncedProgressRef.current = initialProgressSeconds;
   }, [initialProgressSeconds, id]);

   const detectOrientation = useCallback(() => {
    if (typeof window === "undefined") return;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);
    setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
   }, []);

   const requestLandscapeLock = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 768px)").matches) return;
   try {
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (orientation: "portrait" | "landscape") => Promise<void>;
      };
      if (orientation?.lock) {
        await orientation.lock("landscape");
      }
    } catch {
      // Ignore lock failures (browser policy / unsupported device)
    }
   }, []);

   useEffect(() => {
    detectOrientation();
    window.addEventListener("resize", detectOrientation);
    window.addEventListener("orientationchange", detectOrientation);

    requestLandscapeLock();

    const handleFirstInteraction = () => {
      requestLandscapeLock();
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };

    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("click", handleFirstInteraction);

    return () => {
      window.removeEventListener("resize", detectOrientation);
      window.removeEventListener("orientationchange", detectOrientation);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };
   }, [detectOrientation, requestLandscapeLock]);

   const handleProgressChange = useCallback((seconds: number) => {
    if (typeof window === "undefined") return;

    const safeSeconds = Math.max(0, Math.floor(seconds));
    if (lastSyncedProgressRef.current === safeSeconds) return;

    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }

    progressUpdateTimeoutRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams(window.location.search);
      const currentProgress = Number(nextParams.get("progress"));
      if (Number.isFinite(currentProgress) && currentProgress === safeSeconds) {
        lastSyncedProgressRef.current = safeSeconds;
        return;
      }

      nextParams.set("progress", String(safeSeconds));
      const nextUrl = `${window.location.pathname}?${nextParams.toString()}`;
      window.history.replaceState(window.history.state, "", nextUrl);
      lastSyncedProgressRef.current = safeSeconds;
      progressUpdateTimeoutRef.current = null;
    }, PROGRESS_UPDATE_DELAY_MS);
   }, [PROGRESS_UPDATE_DELAY_MS]);

   useEffect(() => {
    return () => {
      if (progressUpdateTimeoutRef.current) {
        clearTimeout(progressUpdateTimeoutRef.current);
      }
    };
   }, []);
  
  const { signedUrl, loading, error } = useSignedUrl({
    resourceId: id,
  });

  // Netflix-style animation variants
  const pageVariants:ExtendedVariants = {
    initial: {
      opacity: 0,
      scale: 1.02, // Subtle scale for depth
      filter: "blur(2px)", // Slight blur for cinematic effect
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Netflix-like easing curve
        staggerChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(1px)",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      }
    }
  };

  const contentVariants:ExtendedVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2, // Slight delay after page fade-in
      }
    }
  };

  return (
    // Main content with Netflix-style fade-in
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-screen w-screen"
    >
      <motion.div 
        variants={contentVariants}
        className="h-full w-full relative"
      >
        {isMobile && isPortrait && (
          <div className="absolute inset-0 z-[1200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="text-center text-white max-w-[320px]">
              <h3 className="text-xl font-semibold mb-2">Rotate Your Device</h3>
              <p className="text-sm text-gray-300 mb-4">
                For the best viewing experience, switch to landscape mode.
              </p>
              <button
                onClick={requestLandscapeLock}
                className="min-h-[44px] px-4 py-2 rounded-md bg-white text-black text-sm font-semibold"
              >
                Switch to Landscape
              </button>
            </div>
          </div>
        )}
        {error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-screen w-screen bg-black flex items-center justify-center"
          >
            <div className="text-center text-white">
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-gray-400">{error}</p>
            </div>
          </motion.div>
        ) : (
          <FsVideoPlayer
            src={signedUrl}
            videoId={id}
            title={title}
            description={description}
            autoPlay={true}
            getDuration={setDuration}
            initialProgressSeconds={initialProgressSeconds}
            onProgressChange={handleProgressChange}
            isPending={isPending || loading}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default WatchMovie
