import Image from "next/image";
import Link from "next/link";
import React from "react";
import Container from "../UI/Container";
import { Button, IconButton } from "@mui/material";
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { useContentCategories } from "@/hooks/useContentCategories";
import { RiTwitterXLine } from "react-icons/ri";

const Footer = ({ light }: { light?: boolean }) => {
  const { categories } = useContentCategories();
  return (
    <div
      className="mt-10"
      style={{
        color: light ? "#000" : "#808080",
        backgroundColor: light ? "#ffffff" : "#000",
      }}
    >
      <Container>
        <div className="pt-30 px-4 md:px-0 pb-10 flex md:flex-row flex-col-reverse justify-between  ">
          <div className="flex flex-col items-center mt-20 md:mt-0">
            <Link href="/">
              <div className="flex flex-row  gap-x-2.5 items-center">
                <Image
                  src={"/logo/logo.svg"}
                  width={50}
                  height={50}
                  alt="wingstream_logo"
                />
                <h1
                  className="text-white font-[700] text-[32px]"
                  style={{ color: light ? "#000" : "#fff" }}
                >
                  FaithStream
                </h1>
              </div>
            </Link>
            <p className="mt-8 font-[500] text-[10px] text-[#808080]">
              © {new Date().getFullYear()}, Faithstream, All rights reserved
            </p>
                      <p className="text-center text-[10px] text-[#808080] font-medium mt-2">Powered by House of Faith</p>
          </div>
          <div>
            <div className="mt-5 flex flex-col items-center md:items-start  justify-center gap-3 md:gap-4 ">
              <Link href="/">
                <p className="text-[14px]">Home</p>
              </Link>

              {categories?.map((cat, idx) => (
                <Link href={`/browse/${cat?.slug}`} key={idx}>
                  <p className="text-[14px]">{cat?.name}</p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mt-5 flex flex-col items-center md:items-start justify-center gap-3 md:gap-4 ">
              <Link href="/legal/terms-and-conditions">
                <p className="text-[14px] text-[#808080]">
                  Terms and Conditions
                </p>
              </Link>

              <Link href="/legal/privacy-policy">
                <p className="text-[14px]">Privacy Policy</p>
              </Link>

              <Link href="/legal/cookies-policy">
                <p className="text-[14px]">Cookies Policy</p>
              </Link>

              <Link href="/support">
                <p className="text-[14px]">Help</p>
              </Link>
            </div>
          </div>
          <div>
            <div className="mt-5 flex flex-col items-center  md:items-start justify-center gap-3 md:gap-4 ">
              <Link href="/make-a-donation">
                <p className="text-[14px]">GIVE</p>
              </Link>
              <Link href="/support/contact-us">
                <p className="text-[14px]">Contact Us</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row items-center gap-x-3 justify-center md:justify-start ">
              <a href="https://www.facebook.com/thefaithstream" target="_blank">
                <IconButton sx={{ border: "1px solid #808080" }}>
                  <FiFacebook className="text-[#808080] text-[16px]" />
                </IconButton>
              </a>
              <a href="https://x.com/thefaithstream" target="_blank">
                <IconButton sx={{ border: "1px solid #808080" }}>
                  <RiTwitterXLine className="text-[#808080] text-[16px]" />
                </IconButton>
              </a>
              <a href="https://instagram.com/thefaithstream" target="_blank">
                <IconButton sx={{ border: "1px solid #808080" }}>
                  <FiInstagram className="text-[#808080] text-[16px]" />
                </IconButton>
              </a>
              <a href="https://www.youtube.com/@aFaithStream" target="_blank">
                <IconButton sx={{ border: "1px solid #808080" }}>
                  <FiYoutube className="text-[#808080] text-[16px]" />
                </IconButton>
              </a>
            </div>
            <div className="mt-20 flex items-center ">
              <a href="https://play.google.com/store/apps/details?id=com.faithstream.faith_stream">
              <Button>
                <Image
                  src="/images/googlestore.png"
                  alt="google_download"
                  width={130}
                  height={50}
                />
              </Button>
              </a>
            <Button sx={{color:'#fff', bgcolor:'#000',  width:'150px', height:'40px', display:'flex', columnGap:2, alignItems:'center' }}>
                                        <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                        </svg>
                                        <div className="flex flex-col items-start">
                                          <span className="text-[10px] opacity-90">Coming Soon on the</span>
                                          <span className="text-[10px] font-black -mt-0.5">App Store</span>
                                        </div>
                                      </Button>
            </div>
          </div>
        </div>
 
      </Container>
    </div>
  );
};

export default Footer;
