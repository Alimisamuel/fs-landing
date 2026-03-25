"use client";

import React, { MutableRefObject, useEffect, useState, useCallback } from "react";
import { Box, Slider, Typography, IconButton, Popover } from "@mui/material";
import Image from "next/image";
import { SlControlPause, SlControlPlay } from "react-icons/sl";
import { useVideoContext } from "@/hooks/VideoSoundContext";

interface FsVideoControlsProps {
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  progress: number;
  duration: number;
  playing: boolean;
  videoReady: boolean;
  showControls: boolean;
  title?: string;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onSeek: (event: Event, value: number | number[]) => void;
  onFullscreen: () => void;
}

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

const FsVideoControls: React.FC<FsVideoControlsProps> = ({
  videoRef,
  progress,
  duration,
  playing,
  videoReady,
  showControls,
  title,
  onTogglePlay,
  onSkip,
  onSeek,
  onFullscreen,
}) => {
  const { isMuted, toggleMute } = useVideoContext();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [volume, setVolume] = useState(1); // 1 = 100%
  const [playbackRate, setPlaybackRate] = useState(1);
  const [speedAnchorEl, setSpeedAnchorEl] = useState<HTMLElement | null>(null);

  // Sync mute + volume with the video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume, videoRef]);

  // Sync playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, videoRef]);

  const handleVolumeChange = useCallback(
    (_: Event, val: number | number[]) => {
      const newVol = (val as number) / 100;
      setVolume(newVol);
      if (newVol > 0 && isMuted) toggleMute(); // auto-unmute if moving slider up
    },
    [isMuted, toggleMute]
  );

  return (
    <>
      {/* Bottom Controls Overlay */}
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
          transition:
            "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out",
          transform: showControls ? "translateY(0)" : "translateY(20px)",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        {/* Progress Bar */}
        <div className="flex flex-row" style={{ position: "relative" }}>
          <Slider
            value={progress}
            min={0}
            max={duration}
            onChange={onSeek}
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

          <Typography variant="body2" sx={{ ml: 1, whiteSpace: "nowrap" }}>
            {formatTime(progress)} / {formatTime(duration)}
          </Typography>
        </div>

        {/* Controls */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={onTogglePlay}
              disabled={!videoReady}
              sx={{
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)",
                width: "60px",
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {playing ? <SlControlPause size={30} /> : <SlControlPlay size={30} />}
            </IconButton>
            <IconButton
              onClick={() => onSkip(-10)}
              disabled={!videoReady}
              sx={{
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)",
                width: "60px",
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                },
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
              onClick={() => onSkip(10)}
              disabled={!videoReady}
              sx={{
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)",
                width: "60px",
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                },
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
                },
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
                },
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
                },
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
              onClick={onFullscreen}
              disabled={!videoReady}
              sx={{
                color: videoReady ? "#fff" : "rgba(255, 255, 255, 0.3)",
                width: "60px",
                height: "60px",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                },
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

      {/* Volume Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        disableRestoreFocus
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.7)",
            p: 1,
            borderRadius: 2,
          },
        }}
      >
        <Slider
          orientation="vertical"
          value={isMuted ? 0 : volume * 100}
          min={0}
          max={100}
          onChange={handleVolumeChange}
          sx={(t) => ({
            mt: 2,
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

      {/* Speed Popover */}
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
                width: "43px",
                height: "43px",
                cursor: "pointer",
                display: "grid",
                placeContent: "center",
                borderRadius: "50%",
                ...((playbackRate === rate) && {
                  border: "1px solid #B3B3B3",
                  p: 2,
                }),
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
                fontSize: "12px",
              }}
            >
              {rate}x{rate === 1 ? " (Normal)" : ""}
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default FsVideoControls;
