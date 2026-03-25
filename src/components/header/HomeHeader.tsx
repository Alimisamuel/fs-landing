/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  AppBar,
  Box,
  IconButton,
  ListItemButton,
  Skeleton,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeaderSearch } from "../Search";
import { IoLanguage, IoMenu } from "react-icons/io5";
import { VscBell } from "react-icons/vsc";
import { IoChevronBack } from "react-icons/io5";
import { motion } from "framer-motion";

import ProfilePop from "./Profile/ProfilePop";
import { usePathname } from "next/navigation";

import DonationModal from "../Donation/DonationModal";
import { useGetQuery } from "@/hooks/useQuery";
import { useContentCategories } from "@/hooks/useContentCategories";
import useBreakpoint from "@/hooks/useBreakpoints";
import MobileSidebar from "./MobileSidebar";

interface Props {
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

const HomeHeader = (props: Props) => {
  const [color, setColor] = React.useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const { isPending, categories } = useContentCategories();

  const listedNav = categories;

  // Check if navigation needs scroll buttons
  const checkScrollButtons = () => {
    const container = navContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setShowScrollButton(scrollWidth > clientWidth);
    }
  };

  // Scroll navigation
  const scrollNav = (direction: "left" | "right") => {
    const container = navContainerRef.current;
    if (container) {
      const scrollAmount = 200; // pixels to scroll
      const currentScroll = container.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

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

  // Check scroll buttons when nav items change
  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [listedNav]);

  // Check scroll buttons on scroll
  const handleNavScroll = () => {
    checkScrollButtons();
  };

  const path = usePathname();

  const [openModal, setOpenModal] = useState(false);
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const { isMobile } = useBreakpoint();

  return (
    <AppBar
      className={`${isMobile ? "appbar_bg" : color ? "appbar_bg" : "appbar"} w-full py-6`}
      sx={{ width: "100%", background: "transparent", boxShadow: "none" }}
    >
      <Box
        sx={{
          margin: "0 auto",
          width: { xl: "90vw", lg: "90vw", md: "90vw", xs: "95vw" },
        }}
      >
        <div className="flex items-center justify-between gap-x-5">
          {/* Logo and Navigation */}
          <div className="flex flex-row items-center gap-x-3 w-[68%] overflow-auto">
            {isMobile && (
              <IconButton onClick={() => setOpenMobileNav(true)}>
                <IoMenu />
              </IconButton>
            )}
            <Link href="/browse">
              <div className="flex flex-row gap-x-2.5 items-center cursor-pointer">
                <Image
                  src={"/logo/logo_white.svg"}
                  width={isMobile ? 20 : 40}
                  height={40}
                  alt="wingstream_logo"
                />

                <h1 className="text-white font-[700] text-[18px] md:text-[24px]">
                  FaithStream
                </h1>
              </div>
            </Link>

            {/* Navigation Buttons */}
            {!isMobile && (
              <div className="relative flex items-center ml-3">
                {/* Left scroll button */}
                {showScrollButton && canScrollLeft && (
                  <IconButton
                    onClick={() => scrollNav("left")}
                    className="absolute left-0 z-10 bg-black bg-opacity-50 hover:bg-opacity-70"
                    sx={{
                      minWidth: "32px",
                      width: "32px",
                      height: "32px",
                      color: "white",
                      borderRadius: "50%",
                      transform: "translateX(-16px)",
                    }}
                  >
                    <IoChevronBack size={16} />
                  </IconButton>
                )}

                {/* Navigation container with fixed width and scroll */}
                <div
                  ref={navContainerRef}
                  className="flex items-center gap-x-2 overflow-x-auto scrollbar-hide"
                  style={{
                    maxWidth: "38vw", // Fixed maximum width
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  onScroll={handleNavScroll}
                >
                  <div className="flex-shrink-0">
                    <NavButton
                      title={"Home"}
                      route={`/browse`}
                      selected={path === "/browse"}
                    />
                  </div>
                  {isPending
                    ? [1, 2, 3, 4, 5].map((_, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex-shrink-0"
                        >
                          <Skeleton
                            sx={{
                              width: "100px",
                              borderRadius: "4px",
                              height: "45px",
                            }}
                            animation="wave"
                          />
                        </motion.div>
                      ))
                    : listedNav.map((nav: any, idx: any) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex-shrink-0"
                        >
                          <NavButton
                            title={nav.name}
                            route={`/browse/${nav.slug}`}
                            selected={
                              decodeURIComponent(path) === `/browse/${nav.slug}`
                            }
                          />
                        </motion.div>
                      ))}
                      <motion.div
                          key={10}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * 10 }}
                          className="flex-shrink-0"
                        >
                          <NavButton
                            title={"My List"}
                            route={`/my-list`}
                            selected={
                              decodeURIComponent(path) === `/my-list`
                            }
                          />
                        </motion.div>
                </div>

                {/* Right scroll button */}
                {showScrollButton && canScrollRight && (
                  <IconButton
                    onClick={() => scrollNav("right")}
                    className="absolute right-0 z-10 bg-black bg-opacity-50 hover:bg-opacity-70"
                    sx={{
                      color: "white",
                      borderRadius: "4px",
                      textTransform: "none",
                      background: "#FFFFFF4D",
                      backdropFilter: "blur(5px)",
                      px: 2,
                      transform: "translateX(16px)",
                    }}
                  >
                    <p className="text-[12px] font-[600]">More...</p>
                  </IconButton>
                )}
              </div>
            )}
          </div>

          {/* Right Side (Search, Language, Bell, Profile) */}
          <div className="flex flex-row items-center gap-x-6">
            <div className="flex flex-row items-center gap-x-2">
              <HeaderSearch />
              {/* <IconButton>
                <IoLanguage className="text-md text-white" />
              </IconButton> */}
              {/* <IconButton>
                <VscBell className="text-md text-white" />
              </IconButton> */}
            </div>
            <ProfilePop />
            {!isMobile && (
              <IconButton
                onClick={() => setOpenModal(true)}
                sx={{ bgcolor: "#fff" }}
              >
                <Image
                  alt="donation"
                  src="/icons/donation_2.svg"
                  width={20}
                  height={25}
                />
              </IconButton>
            )}
          </div>
        </div>
      </Box>

      <DonationModal
        setModal={setOpenModal}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

      <MobileSidebar
        open={openMobileNav}
        onClose={() => setOpenMobileNav(false)}
        navItems={listedNav}
      />
    </AppBar>
  );
};

export default HomeHeader;

interface NavProps {
  route?: string;
  title: string;
  selected?: boolean;
}

const NavButton = ({ title, route = "/", selected }: NavProps) => {
  return (
    <Link href={route} passHref>
      <ListItemButton
        component="a"
        selected={selected}
        className="nav_button"
        sx={{
          color: "white",
          borderRadius: "4px",
          textTransform: "none",
          background: "#FFFFFF4D",
          backdropFilter: "blur(5px)",
          whiteSpace: "nowrap",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          "&.Mui-selected": {
            bgcolor: "#701F63",
          },
        }}
      >
        <p className="font-[600] text-[12px]">{title}</p>
      </ListItemButton>
    </Link>
  );
};
