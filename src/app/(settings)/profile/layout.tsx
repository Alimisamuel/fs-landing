"use client";


import { SettingsHeader } from "@/components/header";

import { IoIosArrowRoundBack } from "react-icons/io";
import { FiUser } from "react-icons/fi";

import React, { useEffect, useState } from "react";
import { ListItemButton } from "@mui/material";

import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/UI/Container";
import Footer from "@/components/Sections/Footer";

const ManageProfile = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const navigate = useRouter();
  const pathname = usePathname();

  const [buttonName, setButtonName] = useState("FaithStream");

  useEffect(() => {
    if (pathname === "/profile/edit-profile") {
      setButtonName("Profile");
    }
    else{
      setButtonName("FaithStream")
    }
  }, [pathname]);
  return (
    <>
      <div className="min-h-screen bg-[#fcfcfc] px-3 md:px-0">
        <SettingsHeader />
        <Container>
          <div className="pt-20 flex flex-col md:flex-row min-h-screen ">
            <div className=" w-full md:w-[17vw] border-b md:border-b-0 md:border-r pt-4 md:pt-10 pr-0 md:pr-4 pb-3 md:pb-0 border-[#EAECF0]">
              <div
                onClick={() => navigate.back()}
                className="text-black flex flex-row items-center gap-x-1 cursor-pointer"
              >
                <IoIosArrowRoundBack className="text-xl" />{" "}
                <p className="hover:underline">Back to {buttonName}</p>
              </div>

              <ListItemButton
                selected
                sx={{
                  color: "#000",
                  mt: 3,
                  display: "flex",
                  alignItems: "center",
                  columnGap: 2,
                  borderRadius: "4px",
                  "&.Mui-selected": {
                    background: "#F5F5F5",
                  },
                }}
              >
                <FiUser className="font-medium" />{" "}
                <p className="font-medium">Manage Profile</p>
              </ListItemButton>
            </div>

            <div className="flex-1 pt-6 md:pt-10 pl-0 md:pl-10">{children}</div>
          </div>
        </Container>
      </div>
      <Footer light />
    </>
  );
};

export default ManageProfile;
