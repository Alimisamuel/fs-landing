import { Button } from "@mui/material";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center not-found-bg">
      <div className="flex items-center gap-2.5">
        <Image src="/logo/logo_white.svg" alt="logo" width={50} height={50} />
        <h2 className="text-white text-[30px] optima">Faithstream</h2>
      </div>
      <h1 className="text-[#ccc] text-[500px] mt-10 leading-[400px]">404</h1>
      <p>Page Not Found</p>
      <Link href="/browse">
        <Button
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
          Back Home
        </Button>
      </Link>
    </div>
  );
}
