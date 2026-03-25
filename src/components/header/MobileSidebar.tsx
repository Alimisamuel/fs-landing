import { ContentNav } from "@/hooks/useContentCategories";
import { StreamingProfile } from "@/lib/types/types";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { TbLogout } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: ContentNav[];
}

const MobileSidebar = ({ open, onClose, navItems }: MobileDrawerProps) => {
  const [profile, setProfile] = useState<StreamingProfile | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const storedProfile = localStorage.getItem("streaming_profile");
    if (!storedProfile) {
      router.push("/team");
    } else {
      setProfile(JSON.parse(storedProfile));
    }
  }, [router]);
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 20,
    height: 20,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <Drawer open={open} onClose={onClose} anchor="left">
      <div className="w-[90vw] bg-black h-screen">
        {/* Header */}
        <div className="px-6 mt-10 flex justify-between items-center">
          <Link href="/browse">
            <div className="flex flex-row gap-x-2.5 items-center cursor-pointer">
              <Image
                src={"/logo/logo_white.svg"}
                width={30}
                height={40}
                alt="wingstream_logo"
              />

              <h1 className="text-white font-[700] text-[18px] md:text-[24px]">
                FaithStream
              </h1>
            </div>
          </Link>
          <IconButton onClick={onClose} sx={{ border: "1px solid #ccc" }}>
            <IoCloseOutline />
          </IconButton>
        </div>

        {/* Profile */}
        <div className="px-6 flex mt-10 gap-x-4 items-center">
          <div>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <SmallAvatar alt="Remy Sharp" src="/logo/logo_white.svg" />
              }
            >
              <Avatar
                alt="Travis Howard"
                src={profile?.avatar}
                sx={{ width: "60px", height: "60px" }}
              />
            </Badge>
          </div>
          <div>
            <p className="font-black">{profile?.name}</p>
            <div className="flex items-center gap-x-2.5 text-[10px] text-[#ccc]">
              <p>Always Premium Member</p>{" "}
              <div className="text-xl leading-0 p-0 m-0 bg-amber-200 w-1 h-1" />{" "}
              <p>Active</p>
            </div>
            <Link href="/profile">
              <Button
                sx={{
                  bgcolor: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #333",
                  px: 3,
                  mt: 1,
                  fontSize: "12px",
                }}
              >
                Manage Profile
              </Button>
            </Link>
          </div>
        </div>

        <Divider sx={{ mt: 3 }} />
        <div className="mt-4">
          <p className="px-6 text-[10px] font-black">CATEGORIES</p>
          <div className="mt-3">
            <Link href="/browse">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * 0 }}
                className="flex items-center justify-between px-6 h-[40px] hover:bg-[#1a1a1a]"
                style={
                  decodeURIComponent(path) === `/browse`
                    ? {
                        backgroundColor: "#1a1a1ab7",
                        borderLeft: "3px solid #701f63",
                        fontWeight: 800,
                        color: "#e9b0df",
                      }
                    : {}
                }
              >
                <p className="text-[14px] text-[#ccc]">Home</p>
              </motion.div>
            </Link>
            {navItems?.map((nav, idx) => (
              <Link href={`/browse/${nav?.slug}`} key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  key={idx}
                  className="flex items-center justify-between px-6 h-[40px] hover:bg-[#1a1a1a]"
                  style={
                    decodeURIComponent(path) === `/browse/${nav.slug}`
                      ? {
                          backgroundColor: "#1a1a1ab7",
                          borderLeft: "3px solid #701f63",
                          fontWeight: 800,
                          color: "#e9b0df",
                        }
                      : {}
                  }
                >
                  <p className="text-[14px] text-[#ccc]">{nav.name}</p>
                </motion.div>
              </Link>
            ))}
            <Link href={`/my-list`}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * 5 }}
                className="flex items-center justify-between px-6 h-[40px] hover:bg-[#1a1a1a]"
                style={
                  decodeURIComponent(path) === `/my-list`
                    ? {
                        backgroundColor: "#1a1a1ab7",
                        borderLeft: "3px solid #701f63",
                        fontWeight: 800,
                        color: "#e9b0df",
                      }
                    : {}
                }
              >
                <p className="text-[14px] text-[#ccc]">My List</p>
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1a1a] fixed bottom-0 h-[50px] w-[90vw] flex items-center">
          <div className="flex-1 h-full">
            <Link href="" className="w-full h-full flex border-r border-[#333]">
              <div className="flex items-center justify-center gap-x-3 w-full h-full">
                <div className=" h-[30px] w-[30px] rounded-full bg-white grid place-content-center">
                  <Image
                    alt="donation"
                    src="/icons/donation_2.svg"
                    width={15}
                    height={25}
                  />
                </div>
                <p className="text-[12px] font-bold">GIVE</p>
              </div>
            </Link>
          </div>
          <div className="flex-1 h-full">
            <div
              onClick={handleLogout}
              className="w-full h-full flex cursor-pointer"
            >
              <div className="flex items-center justify-center gap-x-3 w-full h-full">
                <TbLogout />
                <p className="text-[12px] font-bold">LOGOUT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileSidebar;
