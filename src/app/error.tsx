"use client";

import { Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GlobalError() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center not-found-bg">
      <div className="flex items-center gap-2.5">
        <Image src="/logo/logo_white.svg" alt="logo" width={50} height={50} />
        <h2 className="text-white text-[30px] optima">Faithstream</h2>
      </div>
      <h1 className="text-[#ccc] text-[100px] mt-10 leading-[80px]">ERROR</h1>
      <p> Something went wrong. Please refresh the page or try again.</p>

      <Button
        onClick={() => window.location.reload()}
        className="button"
        variant="contained"
        sx={{
          bgcolor: "white",
          color: "black",
          borderRadius: "50px",
          width: "200px",
          mt: 3,
          py: 2,
        }}
      >
        Refresh
      </Button>
    </div>
  );
}
