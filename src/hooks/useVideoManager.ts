import { useCallback, useEffect, useRef } from 'react';
import { useVideoContext } from './VideoSoundContext';

interface UseVideoManagerOptions {
  videoId: string;
  component: string;
  autoRegister?: boolean;
}

interface VideoManagerReturn {
  // Registration
  registerVideo: (videoElement: HTMLVideoElement, playFn: () => Promise<void> | void, pauseFn: () => void, setMutedFn: (muted: boolean) => void) => void;
  unregisterVideo: () => void;
  
  // Playback control
  playThis: () => Promise<void>;
  pauseThis: () => void;
  
  // Global controls
  pauseAllOthers: () => void;
  pauseAll: () => void;
  
  // State
  isCurrentlyPlaying: boolean;
  isGloballyMuted: boolean;
  globalVideoContext: ReturnType<typeof useVideoContext>;
}

export const useVideoManager = ({ videoId, component, autoRegister = true }: UseVideoManagerOptions): VideoManagerReturn => {
  const videoContext = useVideoContext();
  const registeredRef = useRef(false);
  const videoInstanceRef = useRef<{
    videoElement: HTMLVideoElement;
    play: () => Promise<void> | void;
    pause: () => void;
    setMuted: (muted: boolean) => void;
  } | null>(null);

  const registerVideo = useCallback((
    videoElement: HTMLVideoElement,
    playFn: () => Promise<void> | void,
    pauseFn: () => void,
    setMutedFn: (muted: boolean) => void
  ) => {
    if (registeredRef.current) {
      console.warn(`[useVideoManager] Video ${videoId} is already registered`);
      return;
    }

    const videoInstance = {
      id: videoId,
      videoElement,
      play: playFn,
      pause: pauseFn,
      setMuted: setMutedFn,
      isPlaying: !videoElement.paused,
      component,
    };

    videoInstanceRef.current = {
      videoElement,
      play: playFn,
      pause: pauseFn,
      setMuted: setMutedFn,
    };

    videoContext.registerVideo(videoInstance);
    registeredRef.current = true;
  }, [videoId, component, videoContext]);

  const unregisterVideo = useCallback(() => {
    if (registeredRef.current) {
      videoContext.unregisterVideo(videoId);
      registeredRef.current = false;
      videoInstanceRef.current = null;
    }
  }, [videoId, videoContext]);

  const playThis = useCallback(async () => {
    return videoContext.playVideo(videoId);
  }, [videoId, videoContext]);

  const pauseThis = useCallback(() => {
    videoContext.pauseVideo(videoId);
  }, [videoId, videoContext]);

  const pauseAllOthers = useCallback(() => {
    // Pause all videos except this one
    Object.keys(videoContext.registeredVideos).forEach((id) => {
      if (id !== videoId) {
        videoContext.pauseVideo(id);
      }
    });
  }, [videoId, videoContext]);

  const pauseAll = useCallback(() => {
    videoContext.pauseAllVideos();
  }, [videoContext]);

  // Auto-unregister on unmount
  useEffect(() => {
    return () => {
      unregisterVideo();
    };
  }, [unregisterVideo]);

  const isCurrentlyPlaying = videoContext.currentlyPlayingVideoId === videoId;
  const isGloballyMuted = videoContext.isMuted;

  return {
    registerVideo,
    unregisterVideo,
    playThis,
    pauseThis,
    pauseAllOthers,
    pauseAll,
    isCurrentlyPlaying,
    isGloballyMuted,
    globalVideoContext: videoContext,
  };
};
