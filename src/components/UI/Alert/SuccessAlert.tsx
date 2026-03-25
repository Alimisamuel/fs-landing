"use client";

import React, { forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent } from "notistack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import { VscChromeClose } from "react-icons/vsc";

import Image from "next/image";

interface SuccessAlertProps {
  id: string | number;
  message: string;
}

const SuccessAlert = forwardRef<HTMLDivElement, SuccessAlertProps>(
  ({ id, message }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent
        ref={ref}
      
      >
        <Card
          sx={{
            width: "344px",
             backgroundColor: "#181818b7",
            borderRadius: "8px",
            boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardActions
            sx={{
              padding: "8px 8px 8px 16px",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
           <Image src="/icons/success.svg" alt="success_icon" height={40} width={40}/>
            <Box>
              <Typography
                sx={{
                 
                  color: "#D1FADF",
                  fontSize: "14px",
                  mb: 0.5,
                  fontWeight: 600,
                }}
              >
                Success Message
              </Typography>
              <Typography
        
                sx={{
               
                  color: "#D1FADF",
                  fontSize: "10px",
                }}
              >
                {message}
              </Typography>
            </Box>

            <Box ml="auto">
              <IconButton
                size="small"
                sx={{
                  padding: "8px",
                  color: "#000",
                  transition: "all .2s",
                }}
                onClick={handleDismiss}
              >
              <VscChromeClose className="text-[20px] text-[#D1FADF]" />
              </IconButton>
            </Box>
          </CardActions>
          
        </Card>
      </SnackbarContent>
    );
  }
);

SuccessAlert.displayName = "SuccessAlert";

export default SuccessAlert;
