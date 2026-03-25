"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

interface VideoInstance {
  id: string;
  videoElement: HTMLVideoElement;
  play: () => Promise<void> | void;
  pause: () => void;
  setMuted: (muted: boolean) => void;
  isPlaying: boolean;
  component: string; // Component type for debugging
}

type VideoContextType = {
  // Global mute state
  isMuted: boolean;
  toggleMute: () => void;
  setGlobalMute: (muted: boolean) => void;
  
  // Video instance management
  registerVideo: (video: VideoInstance) => void;
  unregisterVideo: (videoId: string) => void;
  
  // Playback control
  playVideo: (videoId: string) => Promise<void>;
  pauseVideo: (videoId: string) => void;
  pauseAllVideos: () => void;
  getCurrentlyPlayingVideo: () => VideoInstance | null;
  
  // State
  currentlyPlayingVideoId: string | null;
  registeredVideos: Record<string, VideoInstance>;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentlyPlayingVideoId, setCurrentlyPlayingVideoId] = useState<string | null>(null);
  const registeredVideosRef = useRef<Record<string, VideoInstance>>({});
  const [, forceUpdate] = useState({});

  // Force re-render when registered videos change
  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      // Apply mute state to all registered videos
      Object.values(registeredVideosRef.current).forEach((video) => {
        video.setMuted(newMutedState);
      });
      return newMutedState;
    });
  }, []);

  const setGlobalMute = useCallback((muted: boolean) => {
    setIsMuted(muted);
    // Apply mute state to all registered videos
    Object.values(registeredVideosRef.current).forEach((video) => {
      video.setMuted(muted);
    });
  }, []);

  const registerVideo = useCallback((video: VideoInstance) => {
  
    registeredVideosRef.current[video.id] = video;
    
    // Apply current global mute state to newly registered video
    video.setMuted(isMuted);
    
    triggerUpdate();
  }, [isMuted, triggerUpdate]);

  const unregisterVideo = useCallback((videoId: string) => {

    
    // If this was the currently playing video, clear the state
    if (currentlyPlayingVideoId === videoId) {
      setCurrentlyPlayingVideoId(null);
    }
    
    delete registeredVideosRef.current[videoId];
    triggerUpdate();
  }, [currentlyPlayingVideoId, triggerUpdate]);

  const pauseAllVideos = useCallback(() => {

    Object.values(registeredVideosRef.current).forEach((video) => {
      try {
        video.pause();
      } catch (error) {
        console.warn(`Failed to pause video ${video.id}:`, error);
      }
    });
    setCurrentlyPlayingVideoId(null);
  }, []);

  const playVideo = useCallback(async (videoId: string) => {
    const targetVideo = registeredVideosRef.current[videoId];
    if (!targetVideo) {
      console.warn(`[VideoContext] Video not found: ${videoId}`);
      return;
    }


    
    // Pause all other videos first
    Object.entries(registeredVideosRef.current).forEach(([id, video]) => {
      if (id !== videoId) {
        try {
          video.pause();
        } catch (error) {
          console.warn(`Failed to pause video ${id}:`, error);
        }
      }
    });

    // Play the target video
    try {
      await targetVideo.play();
      setCurrentlyPlayingVideoId(videoId);
    } catch (error) {
      console.warn(`Failed to play video ${videoId}:`, error);
    }
  }, []);

  const pauseVideo = useCallback((videoId: string) => {
    const targetVideo = registeredVideosRef.current[videoId];
    if (!targetVideo) {
      console.warn(`[VideoContext] Video not found: ${videoId}`);
      return;
    }

    
    try {
      targetVideo.pause();
      if (currentlyPlayingVideoId === videoId) {
        setCurrentlyPlayingVideoId(null);
      }
    } catch (error) {
      console.warn(`Failed to pause video ${videoId}:`, error);
    }
  }, [currentlyPlayingVideoId]);

  const getCurrentlyPlayingVideo = useCallback(() => {
    if (!currentlyPlayingVideoId) return null;
    return registeredVideosRef.current[currentlyPlayingVideoId] || null;
  }, [currentlyPlayingVideoId]);

  const value: VideoContextType = {
    isMuted,
    toggleMute,
    setGlobalMute,
    registerVideo,
    unregisterVideo,
    playVideo,
    pauseVideo,
    pauseAllVideos,
    getCurrentlyPlayingVideo,
    currentlyPlayingVideoId,
    registeredVideos: registeredVideosRef.current,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
