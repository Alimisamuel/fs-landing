import images from "@/lib/constants/images";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import Footer from "../components/Sections/Footer";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";
import useBreakpoint from "@/hooks/useBreakpoints";

type AuthLayoutsProps = {
  children: ReactNode;
  width?: string;
};

const AuthLayouts = ({ children, width }: AuthLayoutsProps) => {
  const {isMobile } = useBreakpoint()
  return (
    <>
      <div
        className="min-h-screen "
        style={{
          backgroundImage: `url("${images.auth_bg.src}")`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mx-auto pt-4 w-[90%]">
          <Link href="/" >
            <div className="flex flex-row gap-x-2.5 items-center">
              <Image
                src={"/logo/logo.svg"}
                width={isMobile? 30 : 50}
                height={50}
                alt="wingstream_logo"
              />
              <h1 className="text-white font-[700] text-[22px] md:text-[32px]">FaithStream</h1>
            </div>
          </Link>
        </div>
        
          <div className={`mx-auto mt-20 ${width ? width : "w-[95%] md:w-[45%] lg:w-[35%] "}`}>
            {children}
          </div>
      
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default AuthLayouts;
