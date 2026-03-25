"use client";

import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

interface ThumbnailPreviewProps {
  thumbnailUrl: string | null;
  currentTime: number;
  visible: boolean;
  position: { x: number; y: number };
  isLoading?: boolean;
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

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  thumbnailUrl,
  currentTime,
  visible,
  position,
}) => {
  if (!visible || !thumbnailUrl) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
        zIndex: 1000,
        pointerEvents: "none",
        marginBottom: "10px",
    
      }}
    >
      {/* Thumbnail container */}
      <Box
        sx={{
          backgroundColor: "#000",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Thumbnail image */}
        <Box
          component="img"
          src={thumbnailUrl}
          alt="Video thumbnail"
          sx={{
            width: "250px",
            height: "110px",
            display: "block",
            objectFit: "cover",
          }}
        />
        
        {/* Time display */}
   
      </Box>
           <Box
          sx={{
            
       
            backgroundColor: "#181818",
            color: "white",
            padding: "2px 6px",
           display:'flex',
           alignItems:'center',
           justifyContent:'center',
            fontSize: "12px",
            fontWeight: "bold",
            height:'40px'
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "16px", lineHeight: 1, fontWeight:500 }}>
            {formatTime(currentTime)}
          </Typography>
        </Box>
      {/* Arrow pointing down */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          bottom: "-6px",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          
          borderTop: "6px solid #181818",
        }}
      />
    </Box>
  );
};

export default ThumbnailPreview;
