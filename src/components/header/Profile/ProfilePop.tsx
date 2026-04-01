"use client";

import React, { useState, ReactNode, FC, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Ring from "@/components/Sections/Ring";
import images from "@/lib/constants/images";
import { FiHelpCircle, FiUser } from "react-icons/fi";
import { TbLogout, TbSettings } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import { StreamingProfile } from "@/lib/types/types";
import { useProfilesData } from "@/hooks/useProfile";
import { UserProfile } from "@/services/profile";
import { updateAccessToken } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import useBreakpoint from "@/hooks/useBreakpoints";
import { BsPersonVideo3 } from "react-icons/bs";

const ProfilePop: FC = () => {
  const [profile, setProfile] = useState<StreamingProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedProfile = localStorage.getItem("streaming_profile");
    if (!storedProfile) {
      router.push("/team");
    } else {
      setProfile(JSON.parse(storedProfile));
    }
  }, [router]);
  const {isMobile} = useBreakpoint()

  if (!profile) return null;
  return (
    <div className="flex justify-center relative">
     {
      isMobile ? (
         <Link href={"/profile"}>
        <div className="flex flex-row items-center gap-x-2">
          <Ring space="p-[2px]" width="30px">
            <Avatar
              src={
                profile.avatar &&
                profile.avatar !== "undefined" &&
                profile.avatar.trim()
                  ? profile.avatar
                  : undefined
              }
              sx={{ width: "30px", height: "30px" }}
            />
          </Ring>
        </div>
        </Link>
     
      ):(
         <FlyoutLink FlyoutContent={PricingContent}>
        <div className="flex flex-row items-center gap-x-2">
          <Ring space="p-[2px]" width="30px">
            <Avatar
              src={
                profile.avatar &&
                profile.avatar !== "undefined" &&
                profile.avatar.trim()
                  ? profile.avatar
                  : undefined
              }
              sx={{ width: "30px", height: "30px" }}
            />
          </Ring>
        </div>
      </FlyoutLink>
      )
     }
    </div>
  );
};

interface FlyoutLinkProps {
  children: ReactNode;
  FlyoutContent?: FC;
}

const FlyoutLink: FC<FlyoutLinkProps> = ({ children, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative flex flex-col items-center"
    >
      {children}
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full mt-2 bg-black  text-black rounded-lg shadow-lg z-10"
          >
            <div className="relative">
              {/* Optional arrow */}
              <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
              <div className="pt-2">
                <FlyoutContent />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PricingContent: FC = () => {
  const { logout } = useAuth();
  const { data: profilesData } = useProfilesData();
  const router = useRouter();
  const profiles = profilesData?.data || [];

  // Safely parse current profile from localStorage
  const getCurrentProfile = () => {
    try {
      const stored = localStorage.getItem("streaming_profile");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const currentProfile = getCurrentProfile();

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout();
  };

  const handleDispatchProfile = (profile: UserProfile) => {
    localStorage.setItem("streaming_profile", JSON.stringify(profile));

    dispatch(
      updateAccessToken({
        token: profile?.accessToken,
      })
    );
  };

  const handleProfileSwitch = (profile: UserProfile) => {
    handleDispatchProfile(profile);
    // Trigger a softer refresh by navigating to the current page
    router.refresh();
    // Close the popup by triggering a re-render
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="w-[220px] bg-black p-4 shadow-xl">
      {/* Available Profiles Section */}
      {profiles.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <p className="text-white text-[12px] font-[500] mb-3 text-gray-400">
            Switch Profile
          </p>
          <div className="space-y-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileSwitch(profile)}
                className={`py-2 px-2 rounded cursor-pointer flex flex-row items-center gap-x-3 transition-colors ${
                  currentProfile?.id === profile.id
                    ? "bg-gray-800 border border-gray-600"
                    : "hover:bg-grey"
                }`}
              >
                <Ring space="p-[1px]" width="24px">
                  <Avatar
                    src={
                      profile.avatar &&
                      profile.avatar !== "undefined" &&
                      profile.avatar.trim() !== ""
                        ? profile.avatar
                        : "/images/team/guest.png"
                    }
                    sx={{ width: "24px", height: "24px" }}
                  />
                </Ring>
                <p className="text-white text-[13px] font-[400] flex-1 truncate">
                  {profile.name}
                </p>
                {currentProfile?.id === profile.id && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mb-6 space-y-3">
        <Link href="/profile" >
          <div className="py-2 hover:bg-grey rounded cursor-pointer flex flex-row items-center gap-x-4 px-2">
            <FiUser className="text-white" />
            <p className="text-white text-[14px] font-[500] text-nowrap">
              Manage profile
            </p>
          </div>
        </Link>
        <Link href="/account-settings" >
          <div className="py-2 hover:bg-grey rounded cursor-pointer flex flex-row items-center gap-x-4 px-2">
            <TbSettings className="text-white" />
            <p className="text-white text-[14px] font-[500] text-nowrap">
              Account Settings
            </p>
          </div>
        </Link>
        <Link href="/experience" >
          <div className="py-2 hover:bg-grey rounded cursor-pointer flex flex-row items-center gap-x-4 px-2">
           <BsPersonVideo3 className="text-white text-[14px]"/>
            <p className="text-white text-[14px] font-[500] text-nowrap">
              Change Experience
            </p>
          </div>
        </Link>
        <Link href="/make-a-donation" >
          <div className="py-2 hover:bg-grey rounded cursor-pointer flex flex-row items-center gap-x-4 px-2">
            <Image
              src="/icons/donation.svg"
              alt="donation"
              width={15}
              height={15}
            />
            <p className="text-white text-[14px] font-[500] text-nowrap">
              GIVE
            </p>
          </div>
        </Link>
        <Link href="/support" >
          <div className="py-2 hover:bg-grey rounded cursor-pointer flex flex-row items-center gap-x-4 px-2">
            <FiHelpCircle className="text-white" />
            <p className="text-white text-[14px] font-[500] text-nowrap">
              Help/Support
            </p>
          </div>
        </Link>

        <div
          onClick={handleLogout}
          className="py-2 hover:bg-grey hover:backdrop-blur-2xl rounded cursor-pointer flex flex-row items-center gap-x-4 px-2"
        >
          <TbLogout className="text-white" />
          <p className="text-white text-[14px] font-[500]">Sign out</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePop;
