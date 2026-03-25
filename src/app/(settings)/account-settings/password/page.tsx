/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";


import { Button, Chip, Divider, IconButton, InputAdornment, TextField, CircularProgress } from "@mui/material";
import React, { useState } from "react";

import { GoDotFill } from "react-icons/go";
import { AiOutlineDesktop } from "react-icons/ai";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import privateApi from "@/services/api";
import useAlert from "@/hooks/useAlert";

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,18}$/;
  return passwordRegex.test(password);
};

const Password = () => {
const [passwords, setPasswords] = useState({
  current:"",
  new:"",
  confirm:""
})

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordError, setPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleAlert = useAlert();

  const handlePasswordChange = (field: "new" | "confirm", value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));

    if (field === "new") {
      if (value && !validatePassword(value)) {
        setPasswordError(
          "Password must be 8–18 characters, include uppercase, number, and special character."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleChangePassword = async () => {
    // Validation checks
    if (!passwords.current) {
      handleAlert({ message: "Current password is required", variant: "error" });
      return;
    }

    if (!passwords.new) {
      handleAlert({ message: "New password is required", variant: "error" });
      return;
    }

    if (!passwords.confirm) {
      handleAlert({ message: "Confirm password is required", variant: "error" });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      handleAlert({ message: "Passwords do not match", variant: "error" });
      return;
    }

    if (!validatePassword(passwords.new)) {
      handleAlert({ message: "Password must be 8–18 characters, include uppercase, number, and special character.", variant: "error" });
      return;
    }

    if (passwords.current === passwords.new) {
      handleAlert({ message: "New password must be different from current password", variant: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        oldPassword:passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      };

      const response = await privateApi.post('/auth/change-password', payload);

      if (response.data.status) {
        handleAlert({ message: "Password updated successfully", variant: "success" });
        // Clear form
        setPasswords({
          current: "",
          new: "",
          confirm: ""
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update password";
      handleAlert({ message: errorMessage, variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="text-black">
        <p className="text-[18px] font-bold">Password</p>
        <p className="text-[#667085] text-[14px] mt-1">
          Please enter your current password to change your password.
        </p>
       
            <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div>
          <div className="flex flex-row items-center gap-x-4">
            <div className="w-[30%]">
              <p className="text-[14px] font-medium">Current password</p>
            </div>
            <div className="w-[50%] ">
              <TextField
              value={passwords.current}
              onChange={(e)=>setPasswords({...passwords, current:e.target.value})}
                fullWidth
                    type={showPassword.current ? "text" : "password"}
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
                      endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      edge="end"
                    >
                      {showPassword.current ? (
                        <PiEyeThin className="text-[20px]" />
                      ) : (
                        <PiEyeSlashThin className="text-[20px]" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                  },
                }}
            
                placeholder="Current Password"
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-4 mt-5">
            <div className="w-[30%]">
              <p className="text-[14px] font-medium">New password</p>
            </div>
            <div className=" w-[50%] flex flex-row items-center gap-x-3">
              <TextField
                fullWidth
                
                 helperText={passwordError || "Your new password must be more than 8 characters."}
            error={!!passwordError}
            size="small"
            type={showPassword.new ? "text" : "password"}
            value={passwords.new}
               onChange={(e) => handlePasswordChange("new", e.target.value)}
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
                     endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      edge="end"
                    >
                      {showPassword.new ? (
                        <PiEyeThin className="text-[20px]" />
                      ) : (
                        <PiEyeSlashThin className="text-[20px]" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                  },
                }}
                placeholder="New Password"
              />
            </div>
          </div>

          <div className="flex flex-row items-center gap-x-4 mt-5">
            <div className="w-[30%]">
              <p className="text-[14px] font-medium">Confirm new password</p>
            </div>
            <div className="w-[50%] ">
              <TextField
                fullWidth
             size="small"
            type={showPassword.confirm ? "text" : "password"}
            value={passwords.confirm}
            onChange={(e) => handlePasswordChange("confirm", e.target.value)}
            helperText={
              passwords.confirm && passwords.confirm !== passwords.new
                ? "Passwords do not match."
                : ""
            }
            error={!!passwords.confirm && passwords.confirm !== passwords.new}
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
                        endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      edge="end"
                    >
                      {showPassword.confirm ? (
                        <PiEyeThin className="text-[20px]" />
                      ) : (
                        <PiEyeSlashThin className="text-[20px]" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                  },
                  
                }}
                placeholder="New Password"
              />
            </div>
          </div>
        </div>
     
            <Divider sx={{my:4, bgcolor:'#EAECF0'}} />
         <div className="flex justify-end">
          <Button 
            variant="contained" 
            sx={{bgcolor:'#701F63'}}
            onClick={handleChangePassword}
            disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm || !!passwordError || passwords.new !== passwords.confirm}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? "Updating..." : "Update password"}
          </Button>
         </div>
        <p className="text-[18px] font-bold">Where you’re logged in</p>
        <p className="text-[#667085] text-[14px] mt-1">
          We’ll alert you via ayomideopemi85@gmail.com if there is any unusual
          activity on your account.
        </p>
       
            <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div className="flex flex-row gap-x-5">
          <div>
            <AiOutlineDesktop className="text-[25px] mt-1 text-[#667085]" />
          </div>
          <div>
            <div className="flex items-center flex-row gap-x-2 ">
              <p className="font-[500] text-[14px]">2018 Macbook Pro 15-inch</p>{" "}
              <Chip
                size="small"
                icon={<GoDotFill style={{ color: "#0f973d" }} />}
                label="Active now"
                sx={{ color: "#027A48", bgcolor: "#E7F6EC", fontWeight: 500 }}
              />
            </div>
            <p className="text-[#667085] text-[12px]">
              Lagos, Nigeria • 06 May at 10:40am
            </p>
          </div>
        </div>

      
            <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div className="flex flex-row gap-x-5">
          <div>
            <AiOutlineDesktop className="text-[25px] mt-1 text-[#667085]" />
          </div>
          <div>
            <div className="flex items-center flex-row gap-x-2 ">
              <p className="font-[500] text-[14px]">2018 Macbook Pro 15-inch</p>{" "}
            </div>
            <p className="text-[#667085] text-[12px]">
              Lagos, Nigeria • 06 May at 10:40am
            </p>
          </div>
        </div>

       
            <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div className="flex flex-row gap-x-5">
          <div>
            <HiOutlineDevicePhoneMobile className="text-[25px] mt-1 text-[#667085]" />
          </div>
          <div>
            <div className="flex items-center flex-row gap-x-2 ">
              <p className="font-[500] text-[14px]">
                Samsung Galaxy S22 Ultra, 5g
              </p>{" "}
            </div>
            <p className="text-[#667085] text-[12px]">
              Chicago, USA • 05 April at 4:20pm
            </p>
          </div>
        </div>

   
            <Divider sx={{my:5, bgcolor:'#EAECF0'}} />
      </div>
    </>
  );
};

export default Password;
