"use client";

import FsModal from "@/components/custom/FsModal";
import useAlert from "@/hooks/useAlert";
import useBreakpoint from "@/hooks/useBreakpoints";
import { useCreateProfile, useProfilesData } from "@/hooks/useProfile";
import { StreamingProfile } from "@/lib/types/types";
import { UserProfile } from "@/services/profile";
import { useAppDispatch } from "@/store/hooks";
import { updateAccessToken, updateTokens } from "@/store/slices/authSlice";
import { Avatar, Button, IconButton, Skeleton, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";

const Team = () => {
  const { data, isPending } = useProfilesData();
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");

  const dispatch = useAppDispatch();

  const {
    mutate,
    isPending: createPending,
    isError,
    error,
    isSuccess,
  } = useCreateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      mutate(name);
    }
  };

  const handleAlert = useAlert();

  useEffect(() => {
    if (isSuccess) {
      handleAlert({
        message: `Profile created successfully`,
        variant: "success",
      });
      setOpenModal(false);
    } else if (isError) {
      handleAlert({ message: `${error.message}`, variant: "error" });
    }
  }, [isError, isSuccess]);

  const profiles = data?.data || [];
  const route = useRouter();

  const handleDispatchProfile = (profile: UserProfile) => {
    localStorage.setItem("streaming_profile", JSON.stringify(profile));
    route.push("/experience");

    dispatch(
      updateAccessToken({
        token: profile?.accessToken,
      }),
    );
  };

  useEffect(() => {
    if (profiles && profiles.length === 1) {
      handleDispatchProfile(profiles[0]);
    }
  }, [profiles]);

  const profile_completed = profiles.length >= 4;

  const { isMobile } = useBreakpoint();

  const handleSelectProfile = (profile: UserProfile) => {
    handleDispatchProfile(profile);
  };
  return (
    <div className="w-screen min-h-screen bg-black flex flex-col items-center justify-center px-4 md:px-0">
      <h3 className="text-[28px] md:text-[50px] font-[700] optima text-center">
        Who’s watching?
      </h3>
     <div className="
  mx-auto
  grid
  grid-cols-2
  sm:grid-cols-3
  md:flex
  md:flex-row
  items-center
  gap-6
  mt-6
  justify-center
">
        {isPending
          ? [1, 2, 3].map((_, idx) => (
              <Skeleton
                key={idx}
                sx={{
                  width: isMobile ? "80px" : "120px",
                  height: isMobile ? "80px" : "120px",
                }}
                animation="wave"
                variant="rounded"
              />
            ))
          : profiles.map((profile, idx) => (
              <div
                className="w-full md:w-[128px] flex flex-col items-center"
                key={idx}
              >
                <IconButton
                  onClick={() => handleSelectProfile(profile)}
                  sx={{
                    height: isMobile ? "80px" : "130px",
                    width: isMobile ? "80px" : "130px",
                    borderRadius: "0px",
                    padding: 0,
                    "&:hover": {
                      border: "2px solid #e9b0df",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <Avatar
                    sx={{ height: "100%", width: "100%", borderRadius: "8px" }}
                    src={profile.avatar || "/images/team/guest.png"}
                  />
                </IconButton>
                <p className="text-center text-[12px] md:text-[14px] mt-2">
                  {profile.name}
                </p>
              </div>
            ))}
        {!profile_completed && (
         <div className="w-full md:w-[128px] flex flex-col items-center">
            <IconButton
              onClick={() => setOpenModal(true)}
              sx={{
                height: isMobile ? "80px" : "120px",
                width: isMobile ? "80px" : "120px",
              }}
            >
            <div className="bg-[#282828] rounded-full w-[65px] h-[65px] md:w-[90px] md:h-[90px] flex items-center justify-center">
                <div className="bg-[#282828] rounded-full w-[90px] h-[90px] flex flex-row items-center justify-center">
                  <FaPlus className="text-[40px]" />
                </div>
              </div>
            </IconButton>
            <p className="text-center mt-2 ">Add Profile</p>
          </div>
        )}
      </div>
      <Link href="/profile">
        <Button
          startIcon={<FiEdit3 />}
          variant="contained"
          sx={{
           mt: isMobile ? "24px" : "35px",
width: isMobile ? "100%" : "auto",
maxWidth: "320px",
            borderRadius: "4px",
            bgcolor: "#4141414",
            height: "45px",
            px: 3,
          }}
        >
          {" "}
          Manage Profiles
        </Button>
      </Link>
      <FsModal open={openModal} onClose={() => setOpenModal(false)}>
  <div className="
  bg-black
  w-full
  md:w-[500px]
  max-w-[95vw]
  border-[0.5px]
  border-[#333]
  rounded-2xl
  p-5
">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4 md:gap-x-5">
              <Avatar />
              <div className="flex-1">
                <p className=" text-[20px] font-bold text-[#ccc]">
                  Add Profile
                </p>
                <p className="text-[14px]">
                  Add profile for another person watching Faithstream
                </p>

                <div className="mt-4">
                  <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter profile name"
                    fullWidth
                    margin="dense"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-end items-center gap-x-2 mt-4">
              <Button
                onClick={() => setOpenModal(false)}
                variant="outlined"
                sx={{ height: "45px", px: 3 }}
              >
                Cancel
              </Button>
              <Button
                disabled={createPending}
                loading={createPending}
                type="submit"
                variant="contained"
                sx={{ height: "45px", px: 3 }}
              >
                Add Profile
              </Button>
            </div>
          </form>
        </div>
      </FsModal>
    </div>
  );
};

export default Team;
