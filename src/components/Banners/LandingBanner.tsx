"use client";
import React, { Suspense, useState } from "react";

import { LandingHeader } from "../header";
import { Button, Input, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import GlobalLoading from "@/app/loading";
import { BannerData, ContentItem } from "@/services/bannerApi";

const LandingBanner = ({ banner }: { banner?: ContentItem }) => {
  const [email, setEmail] = useState("");

  const route = useRouter();

  const handleGetStarted = () => {
    route.push(`/auth/signup?email=${email}`);
  };

  console.log(banner);

  return (
    <Suspense fallback={<GlobalLoading />}>
      <div className="min-h-[100vh] hero_container pt-[5.5rem]">
        <LandingHeader />

        <div className="relative max-w-7xl mx-auto flex flex-col justify-between h-[80vh] overflow-hidden group">
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={banner?.trailerUrls[0]} type="video/mp4" />
          </video>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(39,18,30,0.5)] to-black"></div>

          <div className=" flex-1 flex justify-center items-center w-[90%] md:w-[70%] mx-auto">
                <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40">
              <h1 className="text-center text-[28px] md:text-[48px]">
                Faith-Filled Stories. Anytime, Anywhere.
              </h1>
              <p className="text-center font-[500] text-[18px] md:text-[24px]">
                Just stories that move your soul.
              </p>
              <p className="text-center mt-5 text-[12px]">
                Enter your email to start watching uplifting, faith-based
                content. No card needed to begin.
              </p>
              <div className=" mt-10 w-full max-w-lg py-0.5 mx-auto h-[55px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center">
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      style: {
                        borderRadius: "8px 0px 8px 0px",
                        border: 0,
                      },
                    },
                  }}
                  sx={{
                    flex: 1,
                    mx: 1,
                    border: 0,
                    "& .MuiOutlinedInput-root": {
                      border: 0,
                      "& fieldset": {
                        borderColor: "transparent",
                        borderRadius: "50px 0px 0px 50px",
                        color: "#667085",
                        border: 0,
                        // Default outline color
                      },
                    },
                  }}
                  size="small"
                />
                <Button
                  onClick={handleGetStarted}
                  variant="contained"
                  sx={{ borderRadius: "50px", mr: 1 }}
                  className="rounded-full h-auto mr-2 text-base font-medium"
                  type="submit"
                >
                  Get started
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-col hidden md:flex items-center justify-center ">
            <p className="text-[14px] font-[300] float-animation mt-7">
              Hover at the center to register
            </p>
          </div>

          {/* Carousel */}
        </div>
      </div>
    </Suspense>
  );
};

export default LandingBanner;
