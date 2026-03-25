"use client";


import { HomeHeader } from "@/components/header";
import Footer from "@/components/Sections/Footer";
import Container from "@/components/UI/Container";
import { ListItemButton, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LuMoveRight } from "react-icons/lu";

const LegalLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  return (
    <>
    <div className="bg-black w-screen">
      <HomeHeader />
      <Toolbar />

      <Container>
        
        <div className="flex mt-15 gap-x-20 ">
          <div className=" hidden md:block">
            <p className="text-green-0 font-[600] text-[14px]">
              FaithStream Terms of Use
            </p>

            <div className="mt-5">
              {NavList.map((nav, idx) => {
                const isSelected = pathname === nav.link;

                return (
                  <Link href={nav.link} key={idx}>
                    <ListItemButton
                      selected={isSelected}
                      sx={{
                        color: "#ffffffb7",
                        "&.Mui-selected": {
                          bgcolor:'#701F63',
                          color: "#fff",
                        },
                      }}
                    >
                      {isSelected && (
                        <LuMoveRight className="text-green-1 mr-2" />
                      )}
                      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                        {nav.title}
                      </Typography>
                    </ListItemButton>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
       
            {children}
          </div>
        </div>
       
        <Footer />
      </Container>
      </div>
    </>
  );
};

export default LegalLayout;

const NavList = [
  {
    title: "Terms & Conditions",
    link: "/legal/terms-and-conditions",
  },
  {
    title: "Privacy Policy",
    link: "/legal/privacy-policy",
  },
  {
    title: "Cookies Policy",
    link: "/legal/cookies-policy",
  },
];
