"use client";

import FsPasswordInput from "@/components/custom/FsPasswordInput";
import Loader from "@/components/UI/Loader";
import AuthLayouts from "@/layouts/AuthLayout";
import { Button, Divider, Grid } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { MuiTelInput } from "mui-tel-input";
import Link from "next/link";
import FsInput from "@/components/custom/FsInputs";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { validateEmail } from "@/lib/helper";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";
import useAlert from "@/hooks/useAlert";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "@/features/Auth/GoogleLogin";

const CLIENT_ID = process.env.NEXT_PUBLIC_API_GOOGLE_CLIENT_ID || ""

const Register = () => {
  const { register, isLoading, error, clearError } = useAuth();

  const handleAlert = useAlert()

    const searchParams = useSearchParams();
  
    const emailFromUrl = searchParams.get("email");
  
   

  const [userDetails, setUserDetails] = useState({
     firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

   useEffect(() => {
      if (emailFromUrl) {
        setUserDetails({...userDetails, email:emailFromUrl});
      }
    }, [emailFromUrl]);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const { email, phone, password } = userDetails;
  const [emailError, setEmailError] = useState<string>("");

  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (!firstName) {
      errors.firstName = "First name is required";
    }

    if (!lastName) {
      errors.lastName = "Last name is required";
    }

    if (!userDetails.email) {
      errors.email = "Email is required";
    } else if (emailError) {
      errors.email = "Email is invalid";
    }

    if (!userDetails.phone) {
      errors.phone = "Phone number is required";
    }

    if (!userDetails.password) {
      errors.password = "Password is required";
    } else if (userDetails.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!userDetails.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (userDetails.password !== userDetails.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

     const clearFormError = (field:keyof typeof userDetails) =>{
 if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }

  const validateName = (
    name: string,
    setError: React.Dispatch<React.SetStateAction<string>>
  ): boolean => {
    const regex = /^[a-zA-Z\s'-]*$/;

    if (name.length > 50) {
      setError("Name cannot exceed 50 characters.");
      return false;
    } else if (!regex.test(name)) {
      setError(
        "Invalid characters detected. Only letters, spaces, hyphens, and apostrophes are allowed."
      );
      return false;
    }

    setError(""); // Clear error
    return true;
  };

  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    clearFormError("firstName")
    if (validateName(input, setFirstNameError)) {
      setFirstName(input);
    }
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    clearFormError("lastName")
    if (validateName(input, setLastNameError)) {
      setLastName(input);
    }
  };

  const handleBlur = (
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    const formattedName = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    setName(formattedName);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setUserDetails({
      ...userDetails,
      email: inputEmail,
    });

    clearFormError("email")

    // Validate email and set error message if invalid
    if (inputEmail && !validateEmail(inputEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

  };

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [userDetails, clearError, error]);

  const route = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await register({
      firstName: firstName,
      lastName: lastName,
      email: userDetails.email,
      phone: userDetails.phone,
      password: userDetails.password,
    });

    if (result.success) {
      route.push(`/auth/verify-account?email=${userDetails.email}`);
    }else{
          handleAlert({
          message: `${result.error}`,
          variant: "error",
        });
    }
  };
 
  return (
    <>
      {isLoading && <Loader />}
      <AuthLayouts>
        <div className="bg-[#00000099] backdrop-blur-md rounded-[10px] p-5">
          <p className="text-center font-[700] text-[25px]">
            Create a Free Account
          </p>
          <p className="text-center mt-2 text-[#ffffffae] text-sm">
            Start watching inspiring, faith-based content in seconds.
          </p>

          <div className="mt-7">
            <form onSubmit={handleSubmit}>
                <ThemeRegistry color="#fff">
              <FsInput
                label="Email Address"
                value={userDetails.email}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
                error={!!emailError || formErrors.email}
                helperText={emailError}
              />

              <Grid container spacing={2}>
                <Grid size={{md:6, xs:12}}>
                  <FsInput
                    sx={{ mt: 1.5 }}
                    value={firstName}
                    onChange={handleFirstNameChange}
                    onBlur={() => handleBlur(firstName, setFirstName)}
                    helperText={firstNameError }
                    error={formErrors.firstName}
                    label="First Name"
                  />
                </Grid>

                <Grid size={{md:6, xs:12}}>
                  <FsInput
                    sx={{ mt: 1.5 }}
                    value={lastName}
                    onChange={handleLastNameChange}
                    onBlur={() => handleBlur(lastName, setLastName)}
                    helperText={lastNameError}
                    label="Last Name"
                     error={formErrors.lastName}
                  />
                </Grid>
              </Grid>

              <MuiTelInput
                fullWidth
                sx={{ mt: 1.5 }}
                slotProps={{
                  input: {
                    style: {
                      fontWeight: 500,
                      fontSize: "14px",
                    },
                  },
                }}
                defaultCountry="NG"
                value={phone}
                onChange={(newValue: string) =>{

                    setUserDetails({ ...userDetails, phone: newValue })
                    clearFormError("phone")
                }
                }
              />
               {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}

              <FsPasswordInput
                sx={{ mt: 1.5 }}
                label="Password"
                value={userDetails?.password}
                onChange={(val) =>{

                    setUserDetails({ ...userDetails, password: val })
                    clearFormError("password")
                }
                }
                error={formErrors.password}
              />
              <FsPasswordInput
                sx={{ mt: 1.5 }}
                label="Confirm Password"
                value={userDetails?.confirmPassword}
                onChange={(val) =>{

                    setUserDetails({ ...userDetails, confirmPassword: val })
                    clearFormError("confirmPassword")
                }
                }
                 error={formErrors.confirmPassword}
              />
</ThemeRegistry>
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
                  Create Account
                </Button>
              </div>
            </form>
            <Divider sx={{ my: 3 }}>or</Divider>
            <div>
              <GoogleOAuthProvider clientId={CLIENT_ID}>
              <GoogleLogin label="Sign up with Google"/>
         
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
                <Image src={icons.microsoft} alt="microsoft" width={20} /> Sign
                In with Microsoft
              </Button> */}
            </div>
          </div>
        </div>
        <p className="text-center mt-3 pb-20">
          Already created an account?{" "}
          <Link href="/auth/login" >
            <b>Login </b>
          </Link>
        </p>
      </AuthLayouts>
    </>
  );
};

export default Register;
