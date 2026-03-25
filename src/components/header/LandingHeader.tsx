"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

import icons from "@/lib/constants/icons";
import { AppBar, Button, useMediaQuery, useTheme } from "@mui/material";

const LandingHeader = () => {
  const [color, setColor] = React.useState(false);

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 10) {
        setColor(true);
      } else {
        setColor(false);
      }
    };

    window.addEventListener("scroll", changeColor);
    changeColor();
    return () => {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);

     const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  return (
    <AppBar
      className={`${color ? " appbar_bg" : "appbar"} w-full py-4`}
      sx={{ width: "100%", background: "transparent", boxShadow: "none", px:{lg:0, xs:2} }}
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between  ">
          <Link href="/" >
            <div className="flex flex-row gap-x-2.5 items-center">
              <Image
                src={"/logo/logo.svg"}
                width={isMobile ? 30 : 45}
                height={isMobile ? 30 : 45}
                alt="wingstream_logo"
              />
              <h1 className="text-white font-[700] text-[18px] md:text-[28px]">FaithStream</h1>
            </div>
          </Link>
          <Link href="/auth/login" >
            <Button
              variant="contained"
              startIcon={<Image src={icons.user} alt="user_icon" width={isMobile ? 15 : 20} />}
              sx={{ height: {md:"45px", xs:'35px'}, px: 3 }}
              className=" rounded-[4px]"
            >
              <p>Sign In</p>
            </Button>
          </Link>
        </div>
      </div>
    </AppBar>
  );
};

export default LandingHeader;
