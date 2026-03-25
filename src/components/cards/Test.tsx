"use client";

import React, { useState } from "react";
import { Box, Card, CardMedia, Typography, IconButton, LinearProgress, Stack, Grow, Paper } from "@mui/material";


interface MovieCardProps {
  title: string;
  image: string;
  episode: string;
  progress: number; // percentage 0 - 100
}

const Test: React.FC<MovieCardProps> = ({ title, image, episode, progress }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        width: 200,
        cursor: "pointer",
        border:'1px solid red',
        flexShrink:0,
       

      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card (Always Visible) */}
      <Card
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardMedia component="img" image={image} alt={title} />
      </Card>

      {/* Overlay Card (Only on Hover) */}
      {isHovered && (
        <Grow in={isHovered}>
          <Paper
            sx={{
              position: "absolute",
              top: -50,
              left: -50,
              width: 300,
              zIndex: 1000,
              height:'300px',
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 6,
              backgroundColor: "#141414",
              color: "white",
            }}
            elevation={8}
          >
            <CardMedia component="img" image={image} alt={title} sx={{ height: 170 }} />

            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <IconButton sx={{ color: "white", backgroundColor: "#333" }} size="small">
              
                </IconButton>
                <IconButton sx={{ color: "white", backgroundColor: "#333" }} size="small">
            
                </IconButton>
                <IconButton sx={{ color: "white", backgroundColor: "#333" }} size="small">
              
                </IconButton>
              </Stack>

              <Typography variant="body2" sx={{ mb: 1 }}>
                {episode}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: "#333",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#e50914",
                  },
                }}
              />
            </Box>
          </Paper>
        </Grow>
      )}
    </Box>
  );
};

export default Test;
