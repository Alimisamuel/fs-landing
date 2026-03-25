"use client";

import { IconButton, LinearProgress, Popper } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Grow } from "@mui/material";
import { IoIosPlay } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { HiOutlineHandThumbUp } from "react-icons/hi2";
import { getSafeMediaUrl, THUMBNAIL_FALLBACK } from "@/utils/helpers";
export type TrendingMovie = {
  title: string;
  year: number;
  category: string;
  image: StaticImageData;
  index: string | number;
  isTop10?: boolean;
  isRecent?: boolean;
  isLeaving?: boolean;
  watching?: boolean;
  video?: string;
};

const GradientLinearProgress = styled(LinearProgress)(({}) => ({
  height: 3,
  borderRadius: 0,
  background: " #FFFFFF59",
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 0,
    background: "linear-gradient(180deg, #6EBDE4 0%, #E08FD3 100%)",

    // your gradient
  },
}));

const VideoCard = ({
  image,
  isTop10,
  isLeaving,
  isRecent,
  watching,
}: TrendingMovie) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [remove, setRemove] = useState(true);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
      setRemove(false);
    }, 500); // 500ms delay
  };

  // Handle hover leave and clear delay
  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setIsHovered(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          cursor: "pointer",
          flexShrink: 0,
        }}
        className="w-[250px] h-[150px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex flex-col border "
          style={{ border: "1px solid red" }}
        >
          <div className=" rounded-sm shadow-lg bg-gradient-to-b from-primary/50 to-black pointer-cursor border">
            {/* Background Image */}
            <Image
              src={getSafeMediaUrl(image, THUMBNAIL_FALLBACK) || THUMBNAIL_FALLBACK} // Replace with your image path
              alt="Faith"
              layout="fill"
              objectFit="cover"
            />

            {/* Top Left Logo */}
            <div className="absolute top-2 left-2 bg-white p-1 rounded-full">
              <Image
                src="/logo/logo_white.svg" // Replace with your logo path
                alt="Logo"
                width={15}
                height={15}
              />
            </div>

            {/* Top Right Tag */}
            {isTop10 && (
              <div
                className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-1 py-2"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
                }}
              >
                <p className="text-[10px]">TOP </p>
                <p className="font-[900] text-center">10</p>
              </div>
            )}

            {/* Bottom Info */}
            {(isLeaving || isRecent) && (
              <div className="absolute bottom-0 w-full">
                <div
                  className="bg-primary text-white text-center py-1 text-xs font-medium w-[40%] mx-auto "
                  style={{ borderRadius: "4px 4px 0px 0px" }}
                >
                  {isLeaving ? "Leaving Soon" : "Recently Added"}
                </div>
              </div>
            )}

            {/* Title Centered */}
            {!image && (
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold flex items-center">
                  FA
                  <span className="mx-1 text-primary">✝</span>
                  TH
                </h2>
              </div>
            )}
          </div>
        </div>
        {!remove && (
          <Grow in={isHovered}>
            <Popper open={isHovered}>
              <Box
                className="bg-gradient-to-b from-primary/50 to-black"
                sx={{
                  position: "absolute",
                  top: -50,
                  left: -50,
                  width: 270,
                  zIndex: 1000,
                  height: "300px",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 6,
                  color: "white",
                  background: "#141414",
                  animationName: isHovered ? "card" : "card-exit",
                  animationDuration: "0.5s",
                  animationFillMode: "forwards",
                  animationTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
                }}
                onAnimationEnd={(e) => {
                  if (e.animationName === "card-exit") {
                    setRemove(true);
                    // setVideo(false);
                  }
                }}
              >
                <Box sx={{ height: "150px" }}>
                  <div className=" w-[100%] h-[150px] rounded-sm shadow-lg bg-gradient-to-b from-primary/50 to-black pointer-cursor overflow-hidden">
                    {/* Background Image */}
                    {/* <Image
        src={image} // Replace with your image path
        alt="Faith"
        layout="fill"
        objectFit="cover"
      /> */}

                    {/* Top Left Logo */}
                    <div className="absolute top-2 left-2 bg-white p-1 rounded-full">
                      <Image
                        src="/logo/logo_white.svg" // Replace with your logo path
                        alt="Logo"
                        width={15}
                        height={15}
                      />
                    </div>

                    {/* Top Right Tag */}
                    {isTop10 && (
                      <div
                        className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-1 py-2"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
                        }}
                      >
                        <p className="text-[10px]">TOP </p>
                        <p className="font-[900] text-center">10</p>
                      </div>
                    )}

                    {/* Bottom Info */}
                    {(isLeaving || isRecent) && (
                      <div className="absolute bottom-0 w-full">
                        <div
                          className="bg-primary text-white text-center py-1 text-xs font-medium w-[40%] mx-auto "
                          style={{ borderRadius: "4px 4px 0px 0px" }}
                        >
                          {isLeaving ? "Leaving Soon" : "Recently Added"}
                        </div>
                      </div>
                    )}

                    {/* Title Centered */}
                    {!image && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-white text-2xl font-bold flex items-center">
                          FA
                          <span className="mx-1 text-primary">✝</span>
                          TH
                        </h2>
                      </div>
                    )}
                  </div>

                  {watching && (
                    <div className=" mt-1 w-[60%] mx-auto">
                      <GradientLinearProgress
                        variant="determinate"
                        value={40}
                      />
                    </div>
                  )}
                </Box>

                <div className="flex flex-row items-center p-4 gap-x-3">
                  <IconButton
                    sx={{
                      bgcolor: "#fff",
                      p: 1,
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <IoIosPlay className="text-[#141414] text-[35px]" />
                  </IconButton>
                  <IconButton
                    sx={{
                      border: "2px solid #FFFFFF80",
                      width: "40px",
                      height: "40px",
                      bgcolor: "#2A2A2A",
                    }}
                  >
                    <IoAddOutline />
                  </IconButton>
                  <IconButton
                    sx={{
                      border: "2px solid #FFFFFF80",
                      width: "40px",
                      height: "40px",
                      bgcolor: "#2A2A2A",
                    }}
                  >
                    <HiOutlineHandThumbUp />
                  </IconButton>
                </div>
              </Box>
            </Popper>
          </Grow>
        )}
      </Box>
    </>
  );
};

export default VideoCard;
