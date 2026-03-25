import React from "react";
import { Box, LinearProgress } from "@mui/material";
import "./styles/glow.scss"
import Image from "next/image";

const GlobalLoading = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
          <Image src={"/logo/logo.svg"} alt="faith_logo" width={60} height={60} />
      <p
        className="glowing-text text-[20px] md:text-[40px] mt-3 "
        style={{ color: "#fff",  fontWeight: 200, }}
      >
       F A I T H S T R E A M
      </p>
      <LinearProgress sx={{mt:1, width:'150px', height:'2px'}} />
    </Box>
  );
};

export default GlobalLoading;
