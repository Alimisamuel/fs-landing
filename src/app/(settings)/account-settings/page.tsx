"use client";


import { Button, Chip, Divider, InputAdornment, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { RxEnvelopeClosed } from "react-icons/rx";
import { MuiTelInput } from "mui-tel-input";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";



interface UserTypes {
  first_name: string;
  last_name: string;
  email: string;
  phone: string ;
}

const Account = () => {
  

  const handleChange = (newValue: string) => {
    setUserInfo({...userInfo, phone:newValue});
  };

  const user = useAppSelector(selectCurrentUser);


  const [userInfo, setUserInfo] = useState<UserTypes>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setUserInfo({
      first_name: user?.firstName || "",
      last_name: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
    });
  }, [user?.firstName, user?.lastName, user?.email, user?.phoneNumber]);


  




  return (
    <>
      <div className="text-black">
        <p className="text-[18px] font-bold">Account Setting</p>
        <p className="text-[#667085] text-[14px] mt-1">
          Update your photo and personal details here.
        </p>
        <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div>
          <div className="flex flex-row items-center gap-x-4">
            <div className="w-[30%]">
              <p className="text-[14px] font-medium">Email address</p>
            </div>
            <div className="w-[50%] ">
              <TextField
                fullWidth
                  value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "4px",
                      color: "#000000 !important",
                      border: "1px solid #D0D5DD",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    style: {
                      height: "45px",
                      fontWeight: 500,
                      fontSize: "14px",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <RxEnvelopeClosed />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip
                          size="small"
                          icon={<GoDotFill style={{ color: "#0f973d" }} />}
                          label="Verified"
                          sx={{ color: "#0F973D", bgcolor: "#E7F6EC" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                placeholder="Email Address"
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-4 mt-5">
            <div className="w-[30%]">
              <p className="text-[14px] font-medium">Name</p>
            </div>
            <div className=" w-[50%] flex flex-row items-center gap-x-3">
              <TextField
                fullWidth
                value={userInfo.first_name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, first_name: e.target.value })
                }
                size="small"
                sx={{
                  width: "50%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "4px",
                      color: "#000000 !important",
                      border: "1px solid #D0D5DD",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    style: {
                      height: "45px",
                      fontWeight: 500,
                      fontSize: "14px",
                    },
                  },
                }}
                placeholder="Email Address"
              />
              <TextField
                fullWidth
                  value={userInfo.last_name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, last_name: e.target.value })
                }
                size="small"
                sx={{
                  width: "50%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "4px",
                      color: "#000000 !important",
                      border: "1px solid #D0D5DD",
                    },
                  },
                }}
                slotProps={{
                  input: {
                    style: {
                      height: "45px",
                      fontWeight: 500,
                      fontSize: "14px",
                    },
                  },
                }}
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="flex flex-row items-center gap-x-4 mt-5">
            <div className="w-[30%]">
              <p className="text-[14px] font-medium">Phone Number</p>
            </div>
            <div className="w-[50%] ">
              <MuiTelInput
                value={userInfo.phone}
                onChange={handleChange
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    style: {
                      height: "45px",
                      fontWeight: 500,
                      fontSize: "14px",
                    },
                  },
                }}
                defaultCountry="NG"
              
              />
            </div>
          </div>
        </div>
   
            <Divider sx={{my:8, bgcolor:'#EAECF0'}} />
        <p className="text-[18px] font-bold">Language Preference & Subtitle</p>
        <p className="text-[#667085] text-[14px] mt-1">
          Select preferred language for content, interface and Subtitle.
        </p>
        
            <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div className="flex flex-row items-center gap-x-4">
          <div className="w-[30%]">
            <p className="text-[14px] font-medium">Select Display Language</p>
            <p className="text-[12px] text-[#667085]">
              This controls the text you see on Faithstream
            </p>
          </div>
          <div className="flex-1 ">
            <TextField
              fullWidth
              select
              size="small"
              sx={{
                width: "70%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "4px",
                    color: "#000000 !important",
                    border: "1px solid #D0D5DD",
                  },
                },
              }}
              slotProps={{
                input: {
                  style: {
                    height: "45px",
                    fontWeight: 500,
                    fontSize: "14px",
                  },
                },
              }}
              label="English (UK)"
            >
              <MenuItem>English(US)</MenuItem>
              <MenuItem>English(UK)</MenuItem>
            </TextField>
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-4 mt-6">
          <div className="w-[30%]">
            <p className="text-[14px] font-medium">
              Select Language for subtitle & audio
            </p>
            <p className="text-[12px] text-[#667085]">
              Select your preferred languages to set up audio and subtitles for
              a better viewing experience.
            </p>
          </div>
          <div className="flex-1 ">
            <TextField
              select
              fullWidth
              size="small"
              sx={{
                width: "70%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "4px",
                    color: "#000000 !important",
                    border: "1px solid #D0D5DD",
                  },
                },
              }}
              slotProps={{
                input: {
                  style: {
                    height: "45px",
                    fontWeight: 500,
                    fontSize: "14px",
                  },
                },
              }}
              label="English (UK)"
            >
              <MenuItem>English(US)</MenuItem>
              <MenuItem>English(UK)</MenuItem>
            </TextField>
          </div>
        </div>

     
            <Divider sx={{my:5, bgcolor:'#EAECF0'}} />
        <div className="flex flex-row justify-end ">
          <Button variant="contained" sx={{height:'45px', borderRadius:'4px'}}>Save Changes</Button>
        </div>
      </div>
    </>
  );
};

export default Account;
