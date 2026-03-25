/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button, Typography } from "@mui/material";
import React, { useState } from "react";

import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import axios from "axios";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import useAlert from "@/hooks/useAlert";
import Loader from "@/components/UI/Loader";
import { useGoogleLoginMutation } from "@/store/slices/authApi";
import { setCredentials, setLoading } from "@/store/slices/authSlice";
import { FcGoogle } from "react-icons/fc";
import { useUserLocation } from "@/hooks/useUserLocation";

export interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  userIpAddress: string;
  country: string;
  countryCode: string;
  city: string;
}

const GoogleLogin = ({ label }: { label: string }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleAlert = useAlert();

  const [googleLoginMutation, { isLoading }] = useGoogleLoginMutation();

  const loginUserWithGoogle = async (userInfo: GoogleUserInfo) => {
    try {
      const response = await googleLoginMutation(userInfo).unwrap();

      if (response.data?.status) {
        // Dispatch user credentials to Redux store
        dispatch(
          setCredentials({
            user: response?.data?.user,
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          }),
        );

        handleAlert({
          message: "Successfully logged in with Google!",
          variant: "success",
        });
        router.push("/team");
      } else {
        handleAlert({
          message: response.message || "Google login failed",
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      handleAlert({
        message:
          error?.data?.message || "Something went wrong during Google login",
        variant: "error",
      });
    }
  };

  const { location } = useUserLocation();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        // Fetch user info from Google
        const { data } = await axios.get<GoogleUserInfo>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        if (data.email) {
          // Pass the Google access token along with email for backend verification

          const payload = {
            ...data,
            userIpAddress: location?.userIpAddress,
            country: location?.country,
            countryCode: location?.countryCode,
            city:location?.city
          };
          await loginUserWithGoogle(payload);
        } else {
          handleAlert({
            message: "Unable to retrieve email from Google account",
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching Google user info:", error);
        handleAlert({
          message: "Unable to fetch Google user information",
          variant: "error",
        });
      }
    },
    onError: (errorResponse) => {
      console.error("Google login failed:", errorResponse);
      handleAlert({
        message: "Google login failed. Please try again.",
        variant: "error",
      });
    },
    scope: "email profile", // Request email and profile permissions
  });

  return (
    <>
      {isLoading && <Loader />}

      <Button
        onClick={() => login()}
        disabled={isLoading}
        fullWidth
        sx={{
          border: "1px solid #4d4d4d",
          borderRadius: "4px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          columnGap: 2,
          color: "#fff",
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        <FcGoogle style={{ fontSize: "30px" }} />
        {isLoading ? "Signing in..." : label}
      </Button>
    </>
  );
};

export default GoogleLogin;
