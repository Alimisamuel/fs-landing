import Footer from "@/components/Sections/Footer";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";
import { Button } from "@mui/material";
import Image from "next/image";
import React from "react";

const NoMobile = () => {
  return (
    <ThemeRegistry color="#701f63">
      <div
        className="h-screen w-screen flex flex-col justify-between"
        style={{
          background: "url('/images/mobile.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-5 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-3 ">
            <Image src="/logo/logo.svg" alt="logo" width={30} height={30} />
            <h2>FaithStream</h2>
          </div>
          {/* <Button variant="contained">Sign in</Button> */}
        </div>

        <div className=" h-[50vh] bg-gradient-to-t from-black/90 via-black/90 to-transparent ">
          <h3 className="font-bold text-[35px] px-1 text-center leading-10">
            Experience Faithstream at its best on the app
          </h3>

          <p className="text-center px-5 mt-4 text-[14px]">
            To watch on your mobile device, you’ll need the Faithstream app. Tap
            below to open Faithstream or download it for free.
          </p>
          <div className="mt-5 w-full">
             <div className="mt-20 flex items-center justify-center gap-x-3 ">
                          <a href="https://play.google.com/store/apps/details?id=com.faithstream.faith_stream">
                          <Button sx={{border:'1px solid #333'}}>
                            <Image
                              src="/images/googlestore.png"
                              alt="google_download"
                              width={130}
                              height={50}
                            />
                          </Button>
                          </a>
                          <a href="https://apps.apple.com/ng/app/faith-stream/id6754464093">
                          <Button sx={{color:'#fff', border:'1px solid #333'}}>
                            <svg
                              className="w-10 h-10"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            <div className="flex flex-col items-start">
                              <span className="text-xs opacity-90">Download on the</span>
                              <span className="text-md font-black -mt-0.5">App Store</span>
                            </div>
                          </Button>
                          </a>
                        </div>
            {/* <a className="w-full flex justify-center " href="https://play.google.com/store/apps/details?id=com.faithstream.faith_stream">
              <Button
                fullWidth
                sx={{ mx: 5, height: "45px", borderRadius: "8px" }}
                variant="contained"
              >
                Open App
              </Button>
            </a> */}
          </div>
        </div>
      </div>
      <Footer/>
    </ThemeRegistry>
  );
};

export default NoMobile;
