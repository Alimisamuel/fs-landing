"use client"


import FsModal from "@/components/custom/FsModal";
import Loader from "@/components/UI/Loader";
import useAlert from "@/hooks/useAlert";
import { useCreateProfile, useCurrentData, useProfilesData } from "@/hooks/useProfile";
import images from "@/lib/constants/images";
import { StreamingProfile } from "@/lib/types/types";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { Avatar, Button, Chip, Divider, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
    const [openModal, setOpenModal] = useState(false);

    const [name, setName] = useState("");

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

   const { data:profilesData, isPending } = useProfilesData();
   const profiles = profilesData?.data || [];
const main_profile = profile


    const full_name = `${main_profile?.name || "User"}`;
    const profile_picture = main_profile?.avatar || "/images/avatar.webp"


    const other_profiles = profiles.filter((p)=>p.id !== main_profile?.id) || []
  return (
    <>
      {
        isPending && <Loader/>
      }
      <div className="text-black flex flex-row gap-x-6 items-center">
        <Avatar
          src={`${profile_picture}`}
          sx={{
            width: "150px",
            height: "150px",
            borderRadius: "8px",
            bgcolor: "#e9b0df80",
          }}
        />
        <div className="">
          <div className="flex flex-row items-center gap-x-7 ">
            <p className="font-bold">{full_name || "--"}</p>{" "}
            <Chip
              sx={{
                color: "#000",
                bgcolor: "#CDECFF",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              size="small"
              label="Your Profile"
            />
          </div>
          <p className="mt-1 text-[#667085]">
            Edit Personal and contact information
          </p>
          <Link href={`/profile/edit-profile?id=${main_profile?.id}`} >
            <Button sx={{mt:3, borderRadius:'4px'}} variant="contained">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
      <Divider sx={{my:4, bgcolor:'#EAECF0'}} />
      <div className="text-black">
        <p className="font-medium ">Other Profiles</p>
        <p className="text-[14px] text-[#667085]">
          Add profile, edit profiles information and parental control
        </p>

        <div className="mt-6">
          {
            other_profiles?.map((profile, idx)=>(
              <>
              <div key={idx} className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-x-4">
              <Avatar
                src={`${profile.avatar || "/images/avatar.webp"}`}
                sx={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "4px",
                  bgcolor: "#e9b0df",
                }}
              />
              <div>
                <p className="font-medium text-[14px]">{profile.name}</p>
                <p className="text-[12px] text-[#667085]">
                  Edit Personal and contact information
                </p>
              </div>
            </div>
              <Link href={`/profile/edit-profile?id=${profile?.id}`}>
               <p className="text-[#667085] text-[14px] cursor-pointer hover:underline font-semibold">
              Edit Profile
            </p>
              </Link>
           
          </div>
          <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
          </>
            ))
          }

          
  

      {/* <Divider sx={{my:3, bgcolor:'#EAECF0'}} /> */}
          <Button disabled={profiles.length >=4} onClick={()=>setOpenModal(true)} variant="contained" fullWidth sx={{mt:3, height:'50px'}} >Add Profile</Button>
          <p className="mt-2 text-[#667085] text-xs" style={{display:profiles.length >=4 ? "none" : "block"}}>
            Add up to 4 Profiles for anyone
          </p>
        </div>
      </div>
      <FsModal open={openModal} onClose={() => setOpenModal(false)}>
       <div className="bg-[#ffffff] w-[400px] border-[0.5px]  rounded-2xl p-5" style={{
 boxShadow: "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814"
}}>
         <form onSubmit={handleSubmit}>
           <div className="flex flex-row gap-x-5 ">
             <Avatar />
             <div className="flex-1">
               <p className=" text-[20px] font-bold text-[#101828]">
                 Add Profile
               </p>
               <p className="text-[14px] text-[#667085]">
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
                   slotProps={{
                     input:{
                       style:{
                         color:'#667085B2',
                         border:'1px solid #D0D5DD'
                       }
                     }
                   }}
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
    </>
  );
};

export default Profile;
