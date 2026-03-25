"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, Slider, Typography, IconButton, CircularProgress, Alert, Popover } from "@mui/material";
import Hls from "hls.js";
import { SlControlPause, SlControlPlay } from "react-icons/sl";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import { VideoThumbnailGenerator } from "../../utils/videoThumbnails";
import { useVideoContext } from "@/hooks/VideoSoundContext";
import { useRouter } from "next/navigation";
import { useStreamingTracker } from "@/hooks/useStreamingTracker";
import { getSafeMediaUrl } from "@/utils/helpers";


interface VideoPlayerProps {
  src: string;
  videoId?: string;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  getDuration?: (duration: number) => void;
  onBack?: () => void;
  initialProgressSeconds?: number;
  onProgressChange?: (seconds: number) => void;
  isPending?:boolean
}

const PAUSED_OVERLAY_DELAY_MS = 3000;

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    : `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const FsVideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  videoId,
  title,
  description = "Press play to continue watching.",
  autoPlay = true,
  getDuration,
  onBack,
  initialProgressSeconds = 0,
  onProgressChange,
  isPending
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const thumbnailGeneratorRef = useRef<VideoThumbnailGenerator | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showPausedOverlay, setShowPausedOverlay] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const pausedOverlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  
  // Cursor idle detection states
  const [showControls, setShowControls] = useState(true);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const { isMuted, toggleMute } = useVideoContext();
  
  // Initialize streaming tracker (only if videoId is provided)
 
  
  const { manualCapture, getCurrentStats, deviceId } = useStreamingTracker({
    videoId: videoId || 'unknown',
    videoElement: videoRef.current,
    isPlaying: playing && videoReady, // Only consider playing when video is actually ready
    enabled: !!videoId && videoReady, // Enable when videoId is provided and video is ready
    captureInterval: 5, // Capture every 5 seconds (for testing)
    minWatchTime: 2 // Minimum 2 seconds before first capture (for testing)
  });

  const togglePlay = useCallback(() => {
  if (!videoRef.current || !videoReady) return;
  if (playing) {
    videoRef.current.pause();
    setPlaying(false);
  } else {
    videoRef.current.play();
    setPlaying(true);
  }
}, [playing, videoReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Reset states when src changes
    setLoading(true);
    setError(null);
    setVideoReady(false);

    // cleanup old Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Add video event listeners
    const handleLoadStart = () => {
      setLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setLoading(false);
      setVideoReady(true);
    };

    const handleError = () => {
      setLoading(false);
      setVideoReady(false);
      setError('Failed to load video. Please try again.');
    };

    const handleLoadedData = () => {
      setLoading(false);
      setVideoReady(true);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        capLevelToPlayerSize: true,
        maxLoadingDelay: 4,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("hls.js error", data);
        if (data.fatal) {
          setLoading(false);
          setVideoReady(false);
          setError('Failed to load video stream. Please try again.');
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari supports HLS natively
      video.src = src;
    } else {
      console.warn("HLS not supported in this browser");
      setLoading(false);
      setVideoReady(false);
      setError('Video format not supported in this browser.');
    }

    if (autoPlay && videoReady) {
      video.play().catch(() => {
        /* ignore autoplay errors */
      });
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, autoPlay]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    setProgress(currentTime);
    onProgressChange?.(Math.max(0, Math.floor(currentTime)));
  };

  const handleSeek = (e: Event, value: number | number[]) => {
    if (!videoRef.current) return;
    const time = value as number;
    videoRef.current.currentTime = time;
    setProgress(time);
    onProgressChange?.(Math.max(0, Math.floor(time)));
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    onProgressChange?.(Math.max(0, Math.floor(videoRef.current.currentTime)));
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        const videoDuration = videoRef.current?.duration || 0;
        setDuration(videoDuration);
        if (getDuration) {
          getDuration(videoDuration);
        }

        if (videoRef.current && initialProgressSeconds > 0) {
          const resumeTime = Math.min(initialProgressSeconds, Math.max(videoDuration - 1, 0));
          videoRef.current.currentTime = resumeTime;
          setProgress(resumeTime);
          onProgressChange?.(Math.max(0, Math.floor(resumeTime)));
        }
        
        if (videoRef.current) {
      
          thumbnailGeneratorRef.current = new VideoThumbnailGenerator(videoRef.current);
        
        }
      };
    }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDuration, initialProgressSeconds, onProgressChange]);

  // Auto-play effect - triggers when video becomes ready
  useEffect(() => {
    if (videoReady && autoPlay && videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setPlaying(true);
        })
        .catch((error) => {

          // Auto-play was prevented (common in browsers), user needs to manually play
        });
    }
  }, [videoReady, autoPlay]);

  useEffect(() => {
    if (pausedOverlayTimeoutRef.current) {
      clearTimeout(pausedOverlayTimeoutRef.current);
      pausedOverlayTimeoutRef.current = null;
    }

    if (playing) {
      setHasStartedPlayback(true);
      setShowPausedOverlay(false);
      return;
    }

    if (!hasStartedPlayback || !videoReady || loading || !!error) {
      setShowPausedOverlay(false);
      return;
    }

    pausedOverlayTimeoutRef.current = setTimeout(() => {
      setShowPausedOverlay(true);
      pausedOverlayTimeoutRef.current = null;
    }, PAUSED_OVERLAY_DELAY_MS);

    return () => {
      if (pausedOverlayTimeoutRef.current) {
        clearTimeout(pausedOverlayTimeoutRef.current);
      }
    };
  }, [playing, hasStartedPlayback, videoReady, loading, error]);

  // Keyboard event handler for spacebar play/pause
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if spacebar is pressed and video is ready
      if (event.code === 'Space' && videoReady) {
        // Prevent default scrolling behavior
        event.preventDefault();
        
        // Only trigger if focus is not on an input element
        const activeElement = document.activeElement as HTMLElement;
        const isInputFocused = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.contentEditable === 'true'
        );
        
        if (!isInputFocused) {
          togglePlay();
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoReady, togglePlay]);

  // Cursor idle detection logic
  const resetIdleTimer = useCallback(() => {
    // Clear existing timeout
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    
    // Show controls and reset idle state
    setShowControls(true);
    setIsIdle(false);
    
    // Set new timeout for 3 seconds of inactivity
    idleTimeoutRef.current = setTimeout(() => {
      setIsIdle(true);
      setShowControls(false);
    }, 3000); // Hide after 3 seconds of inactivity
  }, []);

  const handleMouseMove = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  const handleMouseLeave = useCallback(() => {
    // Don't hide controls immediately when mouse leaves, let the idle timer handle it
    // This prevents flickering when mouse briefly leaves the area
  }, []);


  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
const [volume, setVolume] = useState(1); // 1 = 100%
const [playbackRate, setPlaybackRate] = useState(1);
const [speedAnchorEl, setSpeedAnchorEl] = useState<HTMLElement | null>(null);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.muted = isMuted;
    videoRef.current.volume = volume;
  }
}, [isMuted, volume]);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = playbackRate;
  }
}, [playbackRate]);

// Mouse movement tracking for idle detection
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  // Add event listeners
  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);
  
  // Start the initial idle timer when video starts playing
  if (playing && videoReady) {
    resetIdleTimer();
  }

  return () => {
    // Clean up event listeners
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseleave', handleMouseLeave);
    
    // Clear timeout on cleanup
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
  };
}, [handleMouseMove, handleMouseLeave, resetIdleTimer, playing, videoReady]);

// Start idle detection when video starts playing
useEffect(() => {
  if (playing && videoReady) {
    resetIdleTimer();
  } else {
    // Always show controls when paused
    setShowControls(true);
    setIsIdle(false);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
  }
}, [playing, videoReady, resetIdleTimer]);

 useEffect(()=>{
    if(videoReady && videoRef.current){
      if(isMuted){

        toggleMute()
      }
    }
  },[videoReady, videoRef.current])

  const router = useRouter()

  const handleBack = () =>{
    router.back()
  }

  // Debug function to log current streaming stats (can be called from console)
  useEffect(() => {
    if (typeof window !== 'undefined' && videoId) {
      (window as unknown as { getStreamingStats: () => unknown; manualCapture: () => unknown }).getStreamingStats = () => {
        const stats = getCurrentStats();
        
        return stats;
      };
      (window as unknown as { getStreamingStats: () => unknown; manualCapture: () => unknown }).manualCapture = () => {
      
        return manualCapture();
      };
    }
  }, [videoId, getCurrentStats, manualCapture]);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        position: "relative", 
        width: "100%", 
        height:'100%',
        cursor: showControls ? "default" : "none"
      }}
    >
      <video
        onClick={togglePlay}
        ref={videoRef}
        src={getSafeMediaUrl(src)}
        width="100%"
        muted={isMuted} 
        onTimeUpdate={handleTimeUpdate}
        style={{ borderRadius: "0px", height: "100%" }}
      />
      {/* Loading Overlay */}
      {(loading || isPending)  && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 10,
          
          }}
        >
          <CircularProgress  size={60} />
        </Box>
      )}
      {/* Error Overlay */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 10,
          }}
        >
          <Alert
            severity="error"
            sx={{
              backgroundColor: "rgba(244, 67, 54, 0.9)",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white",
              },
            }}
          >
            {error}
          </Alert>
        </Box>
      )}
      {showPausedOverlay && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.08) 100%)",
            backdropFilter: "blur(1.5px)",
            p: { xs: 3, md: 6 },
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <Box sx={{ maxWidth: { xs: "100%", md: "55%" }, color: "#fff", mb: 8 }}>
            <Image src="/logo/logo.svg" alt="faithsteam_logo" width={40} height={40} className="mb-2"/>
            <Typography sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 600, mb: 1 }}>
              You&apos;re watching
            </Typography>
            <Typography sx={{ fontSize: { xs: 48, md: 74 }, lineHeight: 1, fontWeight: 800, mb: 2 }}>
              {title || "Now Playing"}
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, md: 14 }, lineHeight: 1.35, fontWeight: 500 }}>
              {description}
            </Typography>
          </Box>
        </Box>
      )}
      {/* Back Button Overlay - Only show if onBack is provided */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          p: 2,
          background: "linear-gradient(rgba(0,0,0,0.7), transparent)",
          opacity: showControls ? 1 : 0,
          visibility: showControls ? "visible" : "hidden",
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out",
          transform: showControls ? "translateY(0)" : "translateY(-20px)",
          pointerEvents: showControls ? "auto" : "none",
          zIndex: 5,
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <IoArrowBack size={24} />
        </IconButton>
      </Box>
      {/* Controls Overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          p: 2,
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          color: "#fff",
          opacity: showControls ? 1 : 0,
          visibility: showControls ? "visible" : "hidden",
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out",
          transform: showControls ? "translateY(0)" : "translateY(20px)",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        {/* Progress Bar */}
        <div className="flex flex-row" style={{ position: 'relative' }}>
          {/* <div 
            ref={sliderContainerRef}
            style={{ flex: 1 }}
            onMouseMove={handleSliderMouseMove}
            onMouseEnter={handleSliderMouseEnter}
            onMouseLeave={handleSliderMouseLeave}
          > */}
            <Slider
              value={progress}
              min={0}
              max={duration}
              onChange={handleSeek}
              disabled={!videoReady}
              sx={(t) => ({
                color: "rgba(0,0,0,0.87)",
                height: 4,

                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 8,
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  background: "linear-gradient(180deg, #6EBDE4 0%, #E08FD3 100%)",
                  "&::before": {
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  },
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`,
                    ...t.applyStyles("dark", {
                      boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                    }),
                  },
                  "&.Mui-active": {
                    width: 20,
                    height: 20,
                  },
                },
                "& .MuiSlider-track": {
                  background: "linear-gradient(180deg, #6EBDE4 0%, #E08FD3 100%)",
                  border: "none",
                },
                "& .MuiSlider-rail": {
                  opacity: 0.28,
                  background: "#808080",
                },
                ...t.applyStyles("dark", {}),
              })}
            />
            
            {/* Thumbnail Preview */}
           
          {/* </div> */}
          <Typography variant="body2" sx={{ ml: 1, whiteSpace: "nowrap" }}>
            {formatTime(progress)} / {formatTime(duration)}
          </Typography>
        </div>

        {/* Controls */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={togglePlay}
              disabled={!videoReady}
              sx={{ 
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)", 
                width: "60px", 
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                }
              }}
            >
              {playing ? (
                <SlControlPause size={30} />
              ) : (
                <SlControlPlay size={30} />
              )}
            </IconButton>
            <IconButton
              onClick={() => skip(-10)}
              disabled={!videoReady}
              sx={{ 
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)", 
                width: "60px", 
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                }
              }}
            >
              <Image
                src="/icons/player/prev.svg"
                alt="prev"
                width={30}
                height={30}
                style={{ opacity: videoReady ? 1 : 0.3 }}
              />
            </IconButton>
            <IconButton
              onClick={() => skip(10)}
              disabled={!videoReady}
              sx={{ 
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)", 
                width: "60px", 
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                }
              }}
            >
              <Image
                src="/icons/player/next.svg"
                alt="next"
                width={30}
                height={30}
                style={{ opacity: videoReady ? 1 : 0.3 }}
              />
            </IconButton>
            <IconButton 
              disabled={!videoReady}
              onClick={(e) => setAnchorEl(e.currentTarget)}
               
              sx={{ 
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)", 
                width: "60px", 
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                }
              }}
            >
              <Image
                src="/icons/player/sound.svg"
                alt="sound"
                width={35}
                height={35}
                style={{ opacity: videoReady ? 1 : 0.3 }}
              />
            </IconButton>
          </Box>
          <p className="font-bold one-line-ellipses">{title}</p>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              disabled={!videoReady}
              sx={{ 
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)", 
                width: "60px", 
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                }
              }}
            >
              <Image
                src="/icons/player/subtitle.svg"
                alt="subtitle"
                width={35}
                height={35}
                style={{ opacity: videoReady ? 1 : 0.3 }}
              />
            </IconButton>
            <IconButton 
              disabled={!videoReady}
              onClick={(e) => setSpeedAnchorEl(e.currentTarget)}
              sx={{ 
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)", 
                width: "60px", 
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                }
              }}
            >
              <Image
                src="/icons/player/speed.svg"
                alt="speed"
                width={35}
                height={35}
                style={{ opacity: videoReady ? 1 : 0.3 }}
              />
            </IconButton>
            <IconButton
              onClick={handleFullscreen}
              disabled={!videoReady}
              sx={{ 
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)", 
                width: "60px", 
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                }
              }}
            >
              <Image
                src="/icons/player/expand.svg"
                alt="fullscreen"
                width={35}
                height={35}
                style={{ opacity: videoReady ? 1 : 0.3 }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'center',
  }}
  transformOrigin={{
    vertical: 'bottom',
    horizontal: 'center',
  }}
  disableRestoreFocus
  PaperProps={{
    sx: { 
      bgcolor: "rgba(0,0,0,0.7)", 
      p: 1, 
      borderRadius: 2 
    }
  }}
>
  <Slider
    orientation="vertical"
    value={isMuted ? 0 : volume * 100}
    min={0}
    max={100}
    onChange={(_, val) => {
      const newVol = (val as number) / 100;
      setVolume(newVol);
      if (newVol > 0 && isMuted) toggleMute(); // auto-unmute if moving slider up
    }}
      sx={(t) => ({
mt:2,
                color: "rgba(0,0,0,0.87)",
                height: 80,

                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 8,
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  background: "linear-gradient(180deg, #6EBDE4 0%, #E08FD3 100%)",
                  "&::before": {
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  },
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`,
                    ...t.applyStyles("dark", {
                      boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                    }),
                  },
                  "&.Mui-active": {
                    width: 20,
                    height: 20,
                  },
                },
                "& .MuiSlider-track": {
                  background: "linear-gradient(180deg, #6EBDE4 0%, #E08FD3 100%)",
                  border: "none",
                },
                "& .MuiSlider-rail": {
                  opacity: 0.28,
                  background: "#808080",
                },
                ...t.applyStyles("dark", {}),
              })}
  />
</Popover>
      <Popover
        open={Boolean(speedAnchorEl)}
        anchorEl={speedAnchorEl}
        onClose={() => setSpeedAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.9)",
            color: "#fff",
            p: 2,
            borderRadius: 2,
            textAlign: "center",
          },
        }}
      >
        <div>
          <p className="text-[14px] text-left mb-3">Playback Speed</p>
        </div>
        <Box display="flex" justifyContent="space-between" gap={2}>
          {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
            <Box
              key={rate}
              onClick={() => {
                setPlaybackRate(rate);
                setSpeedAnchorEl(null);
              }}
              sx={{
                   width:'43px',
                height:'43px',
             
                cursor: "pointer",
                display:'grid',
                placeContent:'center',
                borderRadius: "50%",
               ...((playbackRate === rate) && {
                border:'1px solid #B3B3B3',
                p:2
               })
            
                
              }}
            >
            <div className="w-[8px] h-[8px] rounded-full bg-white" />
            </Box>
          ))}
        </Box>
        <Box display="flex" justifyContent="space-between" gap={2}>
          {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
            <Box
              key={rate}
              onClick={() => {
                setPlaybackRate(rate);
                setSpeedAnchorEl(null);
              }}
              sx={{
                cursor: "pointer",
                fontWeight: playbackRate === rate ? "bold" : "normal",
            
                borderRadius: "50%",
                px: 1,
                py: 0.5,
                fontSize:'12px'
              }}
            >
              {rate}x{rate === 1 ? " (Normal)" : ""}
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default FsVideoPlayer;
