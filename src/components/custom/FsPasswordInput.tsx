"use client"

import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
  SxProps,
  Theme,
} from "@mui/material";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,18}$/;
  return passwordRegex.test(password);
};

interface PasswordInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?:string;
  sx?: SxProps<Theme>; 
}

const FsPasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "**************",
    error: externalError,sx, label,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPassword = e.target.value;
    onChange(inputPassword);

    // Validate password
    if (inputPassword && !validatePassword(inputPassword)) {
      setPasswordError(
        "Password must be 8–16 characters, include uppercase, number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={handlePasswordChange}
      error={!!(passwordError || externalError)}
      helperText={passwordError}
      placeholder={placeholder}
       sx={sx} 
      margin="dense"
      {...rest}
      slotProps={{
      input:{
          style: {
          borderRadius: "4px",
        border:'0px'
        },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <PiEyeThin className="text-[20px]" /> : <PiEyeSlashThin className="text-[20px]" />}
            </IconButton>
          </InputAdornment>
        ),
      }
      }}
    />
  );
};

export default FsPasswordInput;
