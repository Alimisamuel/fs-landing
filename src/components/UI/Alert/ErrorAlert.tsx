"use client";

import React, { forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent, CustomContentProps } from "notistack";
import {
  Card,
  CardActions,
  IconButton,
  Typography,
  Box,
  styled,
} from "@mui/material";
import { VscChromeClose } from "react-icons/vsc";
import Image from "next/image";

// Define types for the props of ErrorAlert
interface ErrorAlertProps extends CustomContentProps {
  message: string;
}

const Root = styled(SnackbarContent)(({}) => ({
  "@media (min-width:600px)": {
    maxWidth: "344px !important",
  },
}));

const StyledCard = styled(Card)(({}) => ({
  width: "100%",
  backgroundColor: "#181818b7",
  borderRadius: "8px",
  backdropFilter: "blur(10px)",
 
}));

const ActionRoot = styled(CardActions)(({}) => ({
  padding: "8px 8px 8px 8px",
  justifyContent: "space-between",
  alignItems:'start'
}));

const ExpandIconButton = styled(IconButton)(({}) => ({
  padding: "8px 8px",
  transform: "rotate(0deg)",
  color: "#000",
  transition: "all .2s",
  "&.expandOpen": {
    transform: "rotate(180deg)",
  },
}));

const ErrorAlert = forwardRef<HTMLDivElement, ErrorAlertProps>(
  ({ id, message }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <Root ref={ref}>
        <StyledCard>
          <ActionRoot>
           <Image src="/icons/error.svg" alt="error_icon" width={40} height={40}/>
            <Box>
              <Typography
                sx={{
             
                  color: "#FAD1D3",
                  fontSize: "13px",
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Opps, something went wrong
              </Typography>
              <Typography
            
                sx={{
                
                  color: "#FAD1D3",
                  fontSize: "10px",
                }}
              >
                {message}
              </Typography>
            </Box>

            <div>
              <ExpandIconButton size="small" onClick={handleDismiss}>
                <VscChromeClose className="text-[20px] text-[#FAD1D3]" />
              </ExpandIconButton>
            </div>
          </ActionRoot>
         
        </StyledCard>
      </Root>
    );
  }
);

ErrorAlert.displayName = "ErrorAlert";

export default ErrorAlert;
