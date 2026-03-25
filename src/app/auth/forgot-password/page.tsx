"use client";



import FsInput from "@/components/custom/FsInputs";
import Loader from "@/components/UI/Loader";
import useAlert from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import AuthLayouts from "@/layouts/AuthLayout";
import { validateEmail } from "@/lib/helper";
import { Button } from "@mui/material";


import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

   const { forgotPassword, isLoading, error, clearError } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Validate email and set error message if invalid
    if (inputEmail && !validateEmail(inputEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleAlert = useAlert();

  const navigate = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
     e.preventDefault();
   
 const result = await forgotPassword(email );

    if (result.success) {

      handleAlert({
          message: `An email to reset your password as been sent to you`,
          variant: "success",
        });
    }else{
           handleAlert({
          message: `${result.error}`,
          variant: "error",
        });
    }
   
  };

  return (
    <>
    {
      isLoading && <Loader label="Sending Otp..." />
    }
      <AuthLayouts>
        <div className="bg-[#00000099] backdrop-blur-md rounded-[10px] p-5">
          <p className="text-center font-[700] text-[25px]">Forgot Password?</p>
          <p className="text-center mt-2 text-[#ffffffae] text-sm">
            Enter your registered email to reset your password
          </p>

          <div className="mt-7">
            <form onSubmit={() => handleClick}>
              <FsInput
                label="Email Address"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
                error={!!emailError}
                helperText={emailError}
              />
              <div className="mt-5">
                <Button
                variant="contained"
                  onClick={handleClick}
                  disabled={!email || !!emailError}
                  sx={{height:'50px', borderRadius:'4px', cursor:'pointer'}}
    fullWidth
                  type="submit"
                >
                  Proceed
                </Button>
              </div>
            </form>
          </div>
        </div>
        <p className="text-center text-white mt-4">
          Didn’t forget password?{" "}
          <Link href={"/auth/login"} className="font-bold ">
            Login
          </Link>
        </p>
      </AuthLayouts>
    </>
  );
};

export default ForgotPassword;
