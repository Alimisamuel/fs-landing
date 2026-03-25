"use client";

import FsInput from "@/components/custom/FsInputs";
import FsPasswordInput from "@/components/custom/FsPasswordInput";
import Loader from "@/components/UI/Loader";
import GoogleLogin from "@/features/Auth/GoogleLogin";
import useAlert from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useUserLocation } from "@/hooks/useUserLocation";
import AuthLayouts from "@/layouts/AuthLayout";
import icons from "@/lib/constants/icons";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";
import { Button, Checkbox, Divider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

const CLIENT_ID = process.env.NEXT_PUBLIC_API_GOOGLE_CLIENT_ID || "" ;

const Login = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const { location, isPending } = useUserLocation();

  // console.log(location, "LOCATION");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  const validateForm = () => {
    const errors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const route = useRouter();

  const handleAlert = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login({
      email: formData.email,
      password: formData.password,
      userIpAddress:location?.userIpAddress,
      country:location?.country,
      countryCode:location?.countryCode,
      city:location?.city
    });

    if (result.success) {
      if (!result.data?.data.data.emailVerified) {
        route.push(`/auth/verify-otp?email=${formData.email}`);
      }
    } else {
      handleAlert({
        message: `${result.error}`,
        variant: "error",
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setFormData({
      ...formData,
      email: inputEmail,
    });
  };
  return (
    <AuthLayouts>
      {(isLoading || isPending) && <Loader label="loading..." />}
      <div className="bg-[#00000099] backdrop-blur-md rounded-[10px] p-5">
        <p className="text-center font-[700] text-[25px]">Welcome Back</p>
        <p className="text-center mt-2 text-[#ffffffae] text-sm">
          Sign in to continue watching
        </p>

        <div className="mt-7">
          <form onSubmit={handleSubmit}>
            <ThemeRegistry color="#ffffff">
              <FsInput
                label="Email Address"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <div>
                <FsPasswordInput
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  error={formErrors.password}
                />
              </div>
            </ThemeRegistry>
            <div className="flex flex-row mt-2 justify-between items-center">
              <div className="flex flex-row items-center gap-x-2">
                <Checkbox /> <p className="text-xs">Remember me</p>
              </div>
              <div>
                <Link href="/auth/forgot-password" className="hover:underline">
                  <p className="font-[500] text-xs cursor-pointer">
                    Forgot your password?
                  </p>
                </Link>
              </div>
            </div>
            {/* BUTTON */}
            <div className="mt-5">
              <Button
                onClick={handleSubmit}
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  height: "55px",
                  mt: 5,
                  borderRadius: "4px",
                  textTransform: "initial",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <Divider sx={{ my: 3 }}>or</Divider>
          <div>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
              <GoogleLogin label="Sign In with Google" />
            </GoogleOAuthProvider>
            {/* <Button
              fullWidth
              sx={{
                border: "1px solid #4d4d4d",
                borderRadius: "4px",
                height: "45px",
                mt: 2,
                display: "flex",
                alignItems: "center",
                columnGap: 2,
                color: "#fff",
              }}
            >
              <Image src={icons.microsoft} alt="microsoft" width={20} /> Sign In
              with Microsoft
            </Button> */}
          </div>
        </div>
      </div>
      <p className="text-center mt-3 pb-20">
        New on Faith Stream?{" "}
        <Link href="/auth/signup">
          <b>Sign Up</b>
        </Link>
      </p>
    </AuthLayouts>
  );
};

export default Login;
