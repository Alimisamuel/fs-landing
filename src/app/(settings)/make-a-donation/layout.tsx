"use client";


import { SettingsHeader } from "@/components/header";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";
import { Avatar, ListItemButton, MenuItem } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiGlobe,  } from "react-icons/fi";
import { IoIosArrowRoundBack, IoMdHelpCircleOutline } from "react-icons/io";

import images from "@/lib/constants/images";
import { TbLogout } from "react-icons/tb";


import { PiPhoneCallLight } from "react-icons/pi";
import Container from "@/components/UI/Container";
import Footer from "@/components/Sections/Footer";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";

const AccountLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const navigate = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const [buttonName, setButtonName] = useState("FaithStream");

  useEffect(() => {
    if (pathname === "/profile/edit-profile") {
      setButtonName("Profile");
    } else {
      setButtonName("FaithStream");
    }
  }, [pathname]);
  return (
    <ThemeRegistry color="#C035A9" mode="light">
      <div className="min-h-screen bg-[#fcfcfc]">
        <SettingsHeader />
        <Container>
          <div className="pt-20 flex flex-col md:flex-row min-h-screen ">
            <div className=" w-full md:w-[17vw] border-b md:border-b-0 md:border-r border-[#EAECF0] pt-4 md:pt-10 pr-0 md:pr-4 pb-3 md:pb-0">
              <div
                onClick={() => navigate.push("/browse")}
                className="text-black flex flex-row items-center gap-x-1 cursor-pointer mb-4"
              >
                <IoIosArrowRoundBack className="text-xl" />{" "}
                <p className="hover:underline">Back to {buttonName}</p>
              </div>

              {NavData.map((nav) => (
                <Link href={nav.route} key={nav.route} >
                  <ListItemButton
                    selected={nav.route === pathname}
                    sx={{
                      color: "#000",
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      columnGap: 2,
                      borderRadius: "4px",
                      "&.Mui-selected": {
                        background: "#F5F5F5",
                      },
                    }}
                  >
                    {nav.icon}
                    <p
                      className={`${
                        nav.route === pathname ? "font-medium" : "font-normal"
                      }`}
                    >
                      {nav.name}
                    </p>
                  </ListItemButton>
                </Link>
              ))}
              <MenuItem sx={{ mt: { xs: 2, md: 12 }, justifyContent:'space-between', display:'flex', alignItems:'center' }}>
             
                <div className="flex flex-row items-center gap-x-2.5">
                     <Avatar
                  src={`${user?.profile?.avatar || "/images/avatar.webp"}`}
                  sx={{ border: "1px solid #EBEBEB", }}
                />{" "}
                  <div>
   <p className="text-black font-bold text-[14px]">Log Out</p>
                  <p className="text-[#667085] text-[12px]">{`${user?.firstName} ${user?.lastName}`}</p>
                  </div>
               
                </div>{" "}
                <TbLogout className="text-[#667085]" />
              </MenuItem>
            </div>

            <div className="flex-1 pt-6 md:pt-10 pl-0 md:pl-10">{children}</div>
          </div>
        </Container>
      </div>
      <Footer light/>
    </ThemeRegistry>
  );
};

export default AccountLayout;

const NavData = [
  {
    name: "GIVE",
    icon: <Image alt="donation" src="/icons/donation_2.svg" width={15} height={15}/>,
    route: "/make-a-donation",
  },

 
];
