"use client";

import FsSwitch from "@/components/custom/FsSwitch";
import Loader from "@/components/UI/Loader";
/* eslint-disable @typescript-eslint/no-explicit-any */

import useAlert from "@/hooks/useAlert";
import { useProfilesData } from "@/hooks/useProfile";
import { avatar_urls } from "@/lib/constants/mock";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";
import { StreamingProfile } from "@/lib/types/types";
import { getErrorMessage } from "@/utils/helpers";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios, { AxiosProgressEvent } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ProfileData {
  name: string;
  isKidsProfile: boolean;
  avatar: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
}

const EditProfile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAlert = useAlert();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: profilesData, isPending } = useProfilesData();
  const profiles = profilesData?.data || [];
  const main_profile = profiles.find((p) => p.id === id) || null;

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

  const isCurrentProfile = id === profile?.id

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  // Profile form states
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    isKidsProfile: false,
    avatar: "",
  });
  const [originalData, setOriginalData] = useState<ProfileData>({
    name: "",
    isKidsProfile: false,
    avatar: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Load profile data on component mount
  useEffect(() => {
    // TODO: Replace with actual API call to get user profile
    if (main_profile) {
      const mockProfileData = {
        name: main_profile.name,
        isKidsProfile: main_profile.isKidsProfile,
        avatar: main_profile.avatar,
      };
      if(isCurrentProfile){
         localStorage.setItem("streaming_profile", JSON.stringify(main_profile));
      }
      setProfileData(mockProfileData);
      setOriginalData(mockProfileData);
      setSelectedAvatar(main_profile.avatar);
    }
  }, [main_profile]);

  const handleInputChange =
    (field: keyof ProfileData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear validation error when user starts typing
      if (validationErrors[field as keyof ValidationErrors]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as keyof ValidationErrors];
          return newErrors;
        });
      }
    };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!profileData.name.trim()) {
      errors.name = "Profile name is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      handleAlert({
        message: "Please select a valid image file",
        variant: "error",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      handleAlert({
        message: "File size must be less than 5MB",
        variant: "error",
      });
      return;
    }

    setSelectedFile(file);
    initiateNewUpload(file);
    const imageUrl = URL.createObjectURL(file);
    setSelectedAvatar(imageUrl);
    setProfileData((prev) => ({ ...prev, avatar: imageUrl }));
  };

  const handleAvatarSelect = (avatarPath: string) => {
    setSelectedAvatar(avatarPath);
    setProfileData((prev) => ({ ...prev, avatar: avatarPath }));
    setSelectedFile(null); // Clear uploaded file if selecting from gallery
    setOpen(false); // Close drawer
  };

  const hasChanges = () => {
    return (
      profileData.name !== originalData.name ||
      profileData.isKidsProfile !== originalData.isKidsProfile ||
      profileData.avatar !== originalData.avatar
    );
  };

  const initiateNewUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);
      setUploadedBytes(0);

      const formData = new FormData();
      formData.append("thumbnail", file);

      const response = await axios.post(
        `${apiBaseUrl}/content/thumbnail/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );

              setProgress(percentCompleted);
              setUploadedBytes(progressEvent.loaded);
              setTotalBytes(progressEvent.total);
            }
          },
        }
      );

      const data = response.data;
      const result = data.success && data.data ? data.data : data;

      setProgress(100);
      // const successMsg = `Thumbnail uploaded successfully!`;
      // handleAlert({ message: successMsg, variant: "success" });

      // Update parent with thumbnail URL if available
      if (result.url) {
        setSelectedAvatar(result.url);
      }
    } catch (error: any) {
      let errorMessage = getErrorMessage(error);

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        errorMessage = `Upload failed: ${status} ${error.response.statusText}${
          responseData?.message ? ` - ${responseData.message}` : ""
        }`;
      } else {
        errorMessage = "Upload failed: Network error";
      }

      handleAlert({ message: errorMessage, variant: "error" });
      setProgress(0);
      setUploadedBytes(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    // Save profile data
    const profilePayload = {
      name: profileData.name.trim(),
      isKidsProfile: profileData.isKidsProfile,
      avatar: selectedAvatar,
    };

    try {
      const response = await axios.put(
        `${apiBaseUrl}/users/streaming-profiles/${id}`,
        profilePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
          },
        }
      );
 
      if (response.data.status) {
    
        // Update original data to reflect saved state
        setOriginalData(profilePayload);
        setSelectedFile(null);
        handleAlert({
          message: "Profile updated successfully!",
          variant: "success",
        });
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      handleAlert({ message: errorMessage, variant: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemeRegistry color="#C035A9" mode="light">
      {
        isPending && <Loader label="..."/>
      }
      <div className="text-black">
        <p className="font-bold text-[16px] md:text-[18px] ">Manage profile and preferences</p>
        <p className="text-[#667085] text-[12px] md:text-[14px] mt-1">
          Update your Profile information and Contact information here.
        </p>
        <Divider sx={{ my: 3, bgcolor: "#EAECF0" }} />

        <div className="flex md:flex-row flex-col gap-y-2 ">
          <div className="md:w-[30%] w-full">
            <p className="font-medium text-[16px]">Add your photo</p>
            <p className="text-[#667085] text-[14px]">
              This will be displayed on your profile.
            </p>
          </div>
          <div className="flex-1 flex flex-row gap-x-5">
            <div className="bg-[#F5F5F5] w-[311px] h-[288px] flex flex-col justify-center items-center">
              <Box
                onClick={handleClick}
                sx={{
                  width: "161px",
                  height: "161px",
                  borderRadius: "50%",
                  background: `url(${selectedAvatar})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  sx={{
                    width: "161px",
                    height: "161px",
                    borderRadius: "50%",
                    background: "#00000080",
                    backdropFilter: "blur(1px)",
                    display: "grid",
                    placeContent: "center",
                  }}
                >
                  { isUploading  ? (
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={progress}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{ color: "#fff", fontWeight:600, fontSize:'10px' }}
                        >{`${Math.round(progress)}%`}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <IconButton
                      sx={{
                        height: "60px",
                        width: "60px",
                        boxSizing: "border-box",
                        bgcolor: "#FBF1F9",
                        border: "6px solid #FBF1F9CC",
                      }}
                    >
                      <FiUploadCloud className="text-primary" />
                    </IconButton>
                  )}
                </Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={"image/*"}
                  multiple={false}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </Box>
              <div className="mt-2">
                <p className="text-[14px] text-center">
                  <b className="text-primary">Click to upload </b>
                  or drag and drop
                </p>
                <p className="text-[12px] text-center">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                size="small"
                sx={{
                  color: "#C035A9",
                  bgcolor: "#FBEFF9CC",
                  borderRadius: "8px",
                  fontWeight: 600,
                  textTransform: "initial",
                }}
              >
                Add Faithstream Avatar
              </Button>
            </div>
          </div>
        </div>

        <Divider sx={{ my: 3, mb: 6, bgcolor: "#EAECF0" }} />

        {/* FORM DATA */}

        <div className="flex flex-row items-center gap-x-4 ">
          <div className="w-[30%]">
            <p className="text-[14px] font-medium">Add profile name</p>
            <p className="text-[12px] text-[#667085]">
              This will be displayed on your profile.
            </p>
          </div>
          <div className="flex-1 ">
            <TextField
              fullWidth
              size="small"
              value={profileData?.name}
              onChange={handleInputChange("name")}
              error={!!validationErrors?.name}
              helperText={validationErrors?.name}
              sx={{
                width: "70%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "4px",
                    color: "#000000 !important",
                    border: `1px solid ${
                      validationErrors.name ? "#f44336" : "#D0D5DD"
                    }`,
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
              label="Profile name"
              required
            />
          </div>
        </div>
        <Divider sx={{ my: 5, bgcolor: "#EAECF0" }} />
        <div className="flex flex-row items-center gap-x-4">
          <div className="w-[30%]">
            <p className="text-[14px] font-medium">Kid&#39;s Profile</p>
            <p className="text-[12px] text-[#667085]">
              Enable this option to set the profile as a Kid account. Kid
              accounts have restricted features and tailored settings for a
              safer experience.
            </p>
          </div>
          <div className="flex-1 ">
            <FsSwitch
              checked={profileData.isKidsProfile}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  isKidsProfile: e.target.checked,
                })
              }
            />
          </div>
        </div>

        <Divider sx={{ my: 4, bgcolor: "#EAECF0" }} />

        <div className="flex flex-row justify-end">
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={isUploading || isSaving || !hasChanges()}
            sx={{
              bgcolor: "#701F63",
              height: "55px",
              width: "150px",
              "&:disabled": {
                bgcolor: "rgba(112, 31, 99, 0.5)",
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            {isSaving ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "600px",
            height: "100vh",
            bgcolor: "#fff",
            p: 5,
            overflow: "scroll",
          }}
        >
          <div className="flex flex-row justify-between">
            <div>
              <h5 className="font-bold text-[24px]">Update Profile Picture</h5>
              <p className="text-[14px]">
                This will be displayed on your profile.
              </p>
            </div>
            <div>
              <IconButton onClick={() => setOpen(false)}>
                <IoMdClose />
              </IconButton>
            </div>
          </div>

          <Grid spacing={2} container sx={{ mt: 6, mb: 10 }}>
            {avatar_urls?.map((url) => (
              <Grid size={3} key={url}>
                <IconButton
                  onClick={() => handleAvatarSelect(url)}
                  sx={{
                    border:
                      selectedAvatar === url ? "3px solid #C035A9" : "none",
                    borderRadius: "4px",
                    transition: "border 0.2s ease",
                  }}
                >
                  <Avatar
                    src={url || "/images/avatar.webp"}
                    sx={{
                      height: "115px",
                      width: "115px",
                      borderRadius: "4px",
                      backgroundSize: "115px",
                    }}
                  />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Drawer>
    </ThemeRegistry>
  );
};

export default EditProfile;
