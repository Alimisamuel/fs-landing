"use client";

import React from "react";
import { Box} from "@mui/material";

import VideoCard from "../cards/VideoCard";
import { TrendingMovies } from "@/lib/constants/mock";

const MovieSlider = () => {
  const cardWidth = 220; 
  const visibleCards = 6;
  // const totalCards = 42; 
  // const maxIndex = Math.ceil(totalCards / visibleCards) - 1;

  // const [currentIndex, setCurrentIndex] = useState(0);

  // const handleScroll = (direction: "left" | "right") => {
  //   if (direction === "left" && currentIndex > 0) {
  //     setCurrentIndex(currentIndex - 1);
  //   } else if (direction === "right" && currentIndex < maxIndex) {
  //     setCurrentIndex(currentIndex + 1);
  //   }
  // };

  // const translateX = -currentIndex * (cardWidth * visibleCards);

  return (
    <Box sx={{  overflow: "visible", position: "relative",  }}>
   

      {/* Prev Button */}
      {/* {currentIndex > 0 && (
        <Box
          onClick={() => handleScroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "70%",
            transform: "translateY(-50%)",
            zIndex: 20,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
             height:'150px',
           
          }}
        >
          Prev
        </Box>
      )} */}

      {/* Next Button */}
      {/* {currentIndex < maxIndex && (
        <Box
          onClick={() => handleScroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "70%",
            transform: "translateY(-50%)",
            zIndex: 20,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            height:'150px'
          }}
        >
          Next
        </Box>
      )} */}

      {/* Slider Container */}
      <Box
        sx={{
          width: cardWidth * visibleCards,
          overflow: "visible",
          margin: "0 auto",

        }}
      >
        <Box
        className="hide_scrollbar  "
          sx={{
            display: "flex",
            transition: "transform 0.5s ease",
            // transform: `translateX(${translateX}px)`,
            gap: 2,
           overflowX:'auto',
       
          }}
        >
          {TrendingMovies.map((movie, index) => (
            <VideoCard
              key={index}
              title={movie.title}
              category={movie.category}
              image={movie.image}
              index={index + 1}
              year={movie.year}
              isTop10={movie.isTop10}
              isLeaving={movie.isLeaving}
              isRecent={movie.isRecent}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MovieSlider;
