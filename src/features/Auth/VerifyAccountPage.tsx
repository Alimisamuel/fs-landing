"use client"

import Loader from '@/components/UI/Loader';
import AuthLayouts from '@/layouts/AuthLayout';
import { formatTime, maskEmail } from '@/lib/helper';
import { Button, CircularProgress, styled, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { MuiOtpInput } from "mui-one-time-password-input";
import { useSearchParams } from 'next/navigation';
import useAlert from '@/hooks/useAlert';
import { useAuth } from '@/hooks/useAuth';

const CssOtpInput = styled(MuiOtpInput)(() => ({
  "& input": {
    borderRadius: "4px",
    color: "#ffffff",
    width: "25px",
    height: "38px",
    fontSize: "18px",
    "&:focus": {
      border: "1px solid transparent",
      backgroundImage:
        "linear-gradient(#121212, #121212), linear-gradient(90deg, #6a5af9, #d66efd)",
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box",
      boxShadow: "0 0 12px rgba(133, 94, 255, 0.4)",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "4px",
    },

    "&:hover fieldset": {},
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
}));

const VerifyAccountPage = () => {
  const { verifyEmail, resendOtp, isLoading, error, clearError } = useAuth();
     const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);


  const [email, setEmail] = useState<string>("");
  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get("email");
  

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };

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

    if (!otp || otp.length !== 6) {
      return;
    }

    if (!email) {
      console.error('Email is required for verification');
      return;
    }

    const result = await verifyEmail({
      email: email.replace(/ /g, "+"),
      token: otp,
    });

    if (result.success) {
       setVerified(true);
      handleAlert({
        message: "Account verified successfully!",
        variant: "success",
      });
    }else{
        handleAlert({
          message: `${result.error}`,
          variant: "error",
        });
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (otp.length === 6) {
        handleSubmit();
      }
    }, 300); // wait 300ms before submitting

    return () => clearTimeout(timeout);
  }, [otp]);

 const handleResendOtp = async () => {
    if (!email) {
           handleAlert({
          message: `Email is required to resend OTP`,
          variant: "error",
        });
      console.error('Email is required to resend OTP');
      return;
    }

    const result = await resendOtp(email.replace(/ /g, "+"));

    if (result.success) {
            handleAlert({
          message: `An OTP has been sent to your registered email`,
          variant: "success",
        });
      setTimeLeft(initialTime);
      setOtp('');
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <AuthLayouts width="w-[45%] md:w-[30%]">
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
              Account Verified
            </p>
            <p className="text-center mt-2 text-[#ffffffae] text-sm">
              Your account has been successfully created and verified. Start
              exploring uplifting, faith-based content made just for you.
            </p>

            <div className="mt-10">
              {/* BUTTON */}
              <div className="mt-5">
                <Link href="/browse" >
                  <Button
                    fullWidth
                    variant='contained'
                    type="submit"
                    className="w-full h-[50px] rounded-[4px]"
                  >
                    Start Watching
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#00000099] backdrop-blur-md rounded-[10px] p-5">
              <p className="text-center font-[700] text-[25px]">
                Verify Your Account
              </p>
              <p className="text-center mt-2 text-[#ffffffae] text-sm">
                Enter the digits OTP you just recieved on your email address
                ending with {maskEmail(email || "")}
              </p>

              <div className="mt-10">
                <form onSubmit={handleSubmit}>
                  <CssOtpInput
                    value={otp}
                    onChange={handleChange}
                    length={6}
                    sx={{
                      mt: 1,
                      display: "flex",
                      gap: { md: "20px", xs: "8px" },
                    }}
                    TextFieldsProps={{
                      inputProps: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        style: {
                          fontSize: "18px",
                        },
                      },
                      size: "small",
                    }}
                  />

                  {/* BUTTON */}
                  <div className="mt-5">
                    <Button
                      variant="contained"
                      disabled={otp.length !== 6}
                      type="submit"
                      className="w-full h-[50px] rounded-[4px]"
                    >
                      Account Verified
                    </Button>
                  </div>
                </form>
                <div className="flex flex-row items-center justify-center">
                  {timeLeft <= 0 ? (
                    <Button
                      startIcon={isLoading && <CircularProgress size={20} />}
                      onClick={handleResendOtp}
                      sx={{
                        color: "primary",
                        textDecoration: "underline",
                        mt: 2,
                      }}
                    >
                      Resend OTP
                    </Button>
                  ) : (
                    <Typography
                      sx={{ mt: 2, textAlign: "center", fontSize: "12px" }}
                    >
                      OTP Expires in {formatTime(timeLeft)}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
            <p className="text-center mt-3 pb-20">
              Already created an account?{" "}
              <Link href="/auth/signup" >
                <b>Login</b>
              </Link>
            </p>
          </>
        )}
      </AuthLayouts>
    </>
  );
}

export default VerifyAccountPage;




