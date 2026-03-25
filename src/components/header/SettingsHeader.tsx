"use client";

import { AppBar, IconButton,  } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { BiSolidBell } from "react-icons/bi";
import ProfilePop from "./Profile/ProfilePop";
import Container from "../UI/Container";
import MobileSidebar from "./MobileSidebar";
import useBreakpoint from "@/hooks/useBreakpoints";
import { useContentCategories } from "@/hooks/useContentCategories";
import { IoMenu } from "react-icons/io5";


const SettingsHeader = () => {

  const [openMobileNav, setOpenMobileNav] = useState(false);
  const { isMobile } = useBreakpoint();
   const { isPending, categories } = useContentCategories();


  return (
    <AppBar
      className={` w-full py-4 border-b-[1px] border-[#EAECF0]`}
      sx={{ width: "100%", background: "#fff", boxShadow: "none" }}
    >
      <div className="w-full ">
        <Container>
          <div className=" flex items-center justify-between ">
          <div className="flex flex-row items-center gap-x-3">
             {isMobile && (
                          <IconButton onClick={() => setOpenMobileNav(true)}>
                            <IoMenu className="text-black" />
                          </IconButton>
                        )}
            <Link href="/browse" >
              <div className="flex flex-row gap-x-2.5 items-center">
                <Image
                  src={"/logo/logo.svg"}
                  width={40}
                  height={40}
                  alt="wingstream_logo"
                />
                <h1 className="text-black font-[700] text-[24px]">
                  FaithStream
                </h1>
              </div>
            </Link>
           
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="flex flex-row items-center gap-x-2">
            
             
              <IconButton>
                <BiSolidBell className="text-[24px] text-[#7D7D7D]" />
              </IconButton>
            </div>
           <ProfilePop/>
          </div>
        </div>
        </Container>
      </div>

      <MobileSidebar
        open={openMobileNav}
        onClose={() => setOpenMobileNav(false)}
        navItems={categories}
      />
    </AppBar>
  );
};

export default SettingsHeader;


