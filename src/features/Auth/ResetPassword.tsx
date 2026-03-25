"use client";

import Loader from "@/components/UI/Loader";
import AuthLayouts from "@/layouts/AuthLayout";
import { formatTime, maskEmail } from "@/lib/helper";
import { Button, CircularProgress, styled, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useSearchParams } from "next/navigation";
import useAlert from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import FsPasswordInput from "@/components/custom/FsPasswordInput";

const ResetPassword = () => {
  const { resetPassword, resendOtp, isLoading, error, clearError } = useAuth();

  const [verified, setVerified] = useState(false);

  const [userDetails, setUserDetails] = useState({
    password: "",
    confirmPassword: "",
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const initialTime = 0 * 60 + 59;

  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  React.useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAlert = useAlert();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const result = await resetPassword(token!, userDetails.password);

    if (result.success) {
      setVerified(true);
      handleAlert({
        message: "Account verified successfully!",
        variant: "success",
      });
    } else {
      handleAlert({
        message: `${result.error}`,
        variant: "error",
      });
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <AuthLayouts width="w-[45%] md:w-[40%]">
        {verified ? (
          <div className="bg-[#00000099] backdrop-blur-md rounded-[10px] p-5">
            <div className="flex flex-row justify-center items-center">
              <Image
                src="/images/verify.gif"
                alt="verified"
                width={100}
                height={100}
              />
            </div>
            <p className="text-center font-[700] text-[25px]">
              Password Changed
            </p>
            <p className="text-center mt-2 text-[#ffffffae] text-sm">
              Your password has been successfully updated. Log in to continue
              exploring uplifting, faith-based content made just for you.
            </p>

            <div className="mt-10">
              {/* BUTTON */}
              <div className="mt-5">
                <Link href="/auth/login">
                  <Button
                    fullWidth
                    type="submit"
                    className="w-full h-[50px] rounded-[4px]"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#00000099] backdrop-blur-md rounded-[10px] p-5">
              <p className="text-center font-[700] text-[25px]">
                Reset Password
              </p>

              <div className="mt-10">
                <form onSubmit={handleSubmit}>
                  <FsPasswordInput
                    sx={{ mt: 1.5 }}
                    label="New Password"
                    value={userDetails?.password}
                    onChange={(val) => {
                      setUserDetails({ ...userDetails, password: val });
                    }}
                  />
                  <FsPasswordInput
                    sx={{ mt: 1.5 }}
                    label="Confirm Password"
                    value={userDetails?.confirmPassword}
                    onChange={(val) => {
                      setUserDetails({ ...userDetails, confirmPassword: val });
                    }}
                  />

                  {/* BUTTON */}
                  <div className="mt-5">
                    <Button
                      variant="contained"
                      disabled={
                        !userDetails.password ||
                        !userDetails.confirmPassword ||
                        userDetails.password !== userDetails.confirmPassword
                      }
                      type="submit"
                      className="w-full h-[50px] rounded-[4px]"
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <p className="text-center mt-3 pb-20">
              Remember Password?{" "}
              <Link href="/auth/signup" >
                <b>Login</b>
              </Link>
            </p>
          </>
        )}
      </AuthLayouts>
    </>
  );
};

export default ResetPassword;
