"use client";

import TrendingCard from "@/components/cards/TrendingCard";

import { AiOutlineLike } from "react-icons/ai";
import { FiBarChart2 } from "react-icons/fi";
import { FiTv } from "react-icons/fi";
import { CiFaceSmile } from "react-icons/ci";

import images from "@/lib/constants/images";
import { TrendingMovies } from "@/lib/constants/mock";
import { Button, Divider, Grid, IconButton, Skeleton } from "@mui/material";
import Image from "next/image";

import React, { useEffect, useState } from "react";
import LandingBanner from "@/components/Banners/LandingBanner";
import { useRouter } from "next/navigation";
import Faq from "@/components/Sections/Faq";
import Footer from "@/components/Sections/Footer";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { useGetQuery } from "@/hooks/useQuery";
import { BannerData, ContentItem } from "@/services/bannerApi";
import useBreakpoint from "@/hooks/useBreakpoints";
import mobileBg from "../../../public/images/mobile_bg.png";
import { IoMdClose } from "react-icons/io";

interface ContentRes {
  data: {
    data: { videos: ContentItem[]; banner: BannerData }[];
  };
}

const HomePage = () => {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useRouter();
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      navigate.push("/browse");
    }
  }, [user]);

  const { data, isPending } = useGetQuery<ContentRes>(
    ["landing_movies"],
    "content/categories-landing-page?limit=10",
  );

  const trendingVideos = data?.data?.data?.[0]?.videos;
  const trendingBanner = data?.data?.data?.[0]?.videos[0];

  useEffect(() => {
    if (isMobile) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <div className="bg-black overflow-hidden">
        <LandingBanner banner={trendingBanner} />
        <div
          style={{ height: "107px" }}
          className="bg-gradient-to-t from-black/90 to-[#3434345d] border-t border-black "
        />
        <div className="md:w-[85%] w-[95%] mx-auto mt-[-50px] px-5 md:px-0">
          <div className="">
            <h3 className="font-[700] text-[28px] text-[#E5E5E5]">
              Trending Now
            </h3>

            <div className="mt-5 ml-[-10px] flex flex-row gap-x-3 items-center overflow-x-scroll mr-[-72px] hide_scrollbar">
              {isPending ? (
                <>
                  {[...Array(4)]?.map((_, idx) => (
                    <Skeleton
                      animation="wave"
                      sx={{ width: "240px", height: "180px", flexShrink: 0 }}
                      key={idx}
                      variant="rectangular"
                    />
                  ))}
                </>
              ) : (
                <>
                  {trendingVideos?.map((movie, index) => (
                    <TrendingCard
                      key={index}
                      title={movie.title}
                      category={movie?.categories[0]}
                      image={movie?.thumbnailUrls[0] || ""}
                      index={index + 1}
                      // year={movie.year}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
          <Divider sx={{ my: 7, mx: -10 }} />

          <div>
            <h3 className="font-[700] text-[28px] text-[#E5E5E5]">
              Why you will love Faithstream
            </h3>
            <div className="mt-8">
              <Grid container spacing={2}>
                {Features.map((f, index) => (
                  <Grid size={{ lg: 3, xs: 12 }} key={index}>
                    <div className="bg-[#141414] h-[230px] p-6 rounded flex flex-col justify-between">
                      <div className="h-[40px] w-[40px] card_gradient rounded-[8px] flex flex-row items-center justify-center">
                        <div>
                          <f.icon />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-[700]"> {f.title}</h4>
                        <p className="mt-2 text-[12px]">{f.label}</p>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
          <div className="w-[90%] md:w-[75%] mx-auto mt-30 flex md:flex-row flex-col items-center gap-x-6 ">
            <div className="w-full md:w-1/2">
              <Image src={images.mockup} alt="watch" width={500} height={100} />
            </div>
            <div className="w-full md:w-1/2 mt-5 md:mt-0">
              <h3 className="font-[700] text-[28px] text-center md:text-left">
                Watch anywhere, anytime
              </h3>
              <p className="mt-2 text-sm text-center md:text-left">
                Stream on any device. Watch inspiring movies and shows on your
                phone, tablet, computer, or smart TV, anytime you want.
              </p>

              <div className="mt-6 flex flex-row items-center gap-x-3 justify-center md:justify-start">
                <Button className="p-0">
                  <Image alt="apple_badge" src={images.applestore} />
                </Button>
                <Button className="p-0">
                  <Image alt="apple_badge" src={images.playstore} />
                </Button>
              </div>
            </div>
          </div>

          <div className=" mx-auto mt-30 mb-10">
            <Faq />
          </div>

          {/* GET IN TOUCH  */}

          <div className="bg-[#242424] p-8 flex flex-col items-center ">
            <Image src={images.avatar} alt="teams" width={120} />
            <p className="mt-8 font-[500] text-[20px]">Still have questions?</p>
            <p className="mt-2 text-sm">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>
            <Button className="bg-grey mt-7 rounded-[8px]">Get in Touch</Button>
          </div>

          {/* FOOOTERRRRRR */}
          <Footer />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />

        {/* Modal */}
        <div
          className={`relative bg-none  rounded-2xl shadow-xl w-[90%] max-w-md transform transition-all duration-300 ${
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-10 scale-95 opacity-0"
          }`}
        >
          <div className="">
            <div className="grid place-content-center mb-2">
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ bgcolor: "#fff" }}
              >
                <IoMdClose className="text-black" />
              </IconButton>
            </div>
            <div
              className="h-[70px] rounded-b-[16px]"
              style={{
                background: `url(${mobileBg.src})`,
                backgroundSize: "cover",
              }}
            />
            <div className="bg-[#fff] rounded-t-[16px] p-5">
              <h1 className="text-primary text-[20px] text-center">
                Get the Full Experience 🚀
              </h1>
              <p className="text-gray-500 text-[12px] text-center mb-5">
                Download our mobile app for faster checkout, exclusive deals,
                and a better shopping experience.
              </p>

              <div className="flex flex-col justify-center items-center gap-y-5">
                <a href="https://play.google.com/store/apps/details?id=com.faithstream.faith_stream">
                  <Button sx={{}}>
                    <Image
                      src="/images/googlestore.png"
                      alt="google_download"
                      width={130}
                      height={50}
                    />
                  </Button>
                </a>
                <a href="https://apps.apple.com/ng/app/faith-stream/id6754464093">
                  <Button
                    sx={{
                      color: "#000",
                      border: "1px solid #333",
                      bgcolor: "000",
                    }}
                  >
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <div className="flex flex-col items-start">
                      <span className="text-xs opacity-90 text-white">
                        Download on the
                      </span>
                      <span className="text-md font-black -mt-0.5 text-white">
                        App Store
                      </span>
                    </div>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

const Features = [
  {
    icon: AiOutlineLike,
    title: "Handpicked for Your Heart",
    label:
      "Get personalized recommendations based on your interests and spiritual journey",
  },
  {
    icon: FiBarChart2,
    title: "No Ads. No Distractions.",
    label:
      "Enjoy uninterrupted streaming so you can focus on the message, not the marketing.",
  },
  {
    icon: FiTv,
    title: "Stream Anytime, Anywhere",
    label:
      "Access FaithStream on mobile, web, or smart TV. Faith travels with you.",
  },
  {
    icon: CiFaceSmile,
    title: "Safe for kids",
    label:
      "Engaging, educational, and faith based content made especially for young hearts and growing minds.",
  },
];
