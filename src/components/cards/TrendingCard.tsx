import Image, { StaticImageData } from "next/image";

import React, { useState } from "react";

import { IoIosPlay } from "react-icons/io";
import Link from "next/link";
import { Button, IconButton } from "@mui/material";
import FsModal from "../custom/FsModal";
import { AiOutlineClose } from "react-icons/ai";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";

export type TrendingMovie = {
  title: string;
  category: string;
  image: string;
  index: string | number;
  year?: number;
};

const TrendingCard = ({
  image,
  index,
  title,
  year,
  category,
}: TrendingMovie) => {
  const [openModal, setOpenModal] = useState(false);

 
  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="w-[240px] h-[180px] group overflow-hidden group relative rounded-[4px] flex-shrink-0 cursor-pointer"
      >
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className=" p-3 flex flex-col justify-between inset-0 absolute bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-102"
        >
          <div className="flex flex-col justify-between h-100 ">
            <div className="w-5 bg-white p-1 rounded-full">
              <Image
                src="/logo/logo_white.svg" // Replace with your logo path
                alt="Logo"
                width={15}
                height={15}
              />
            </div>
            <div className="rounded-full flex flex-row justify-center items-center card_gradient w-fit p-[2px]">
              <div className="h-[30px] w-[30px] rounded-full bg-[#A5A5A566] backdrop-blur-md flex flex-row items-center justify-center">
                <p className="font-[500]">{index}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FsModal
        width={"60vw"}
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div
          className="w-full h-[60vh] border-0 flex flex-col justify-between rounded-[8px] px-10"
          style={{
            backgroundImage: `linear-gradient(rgba(39, 18, 30, 0 ), rgba(39, 18, 30, 0.9)), url(${image})`,

            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex-1">
            <div className="flex flex-row justify-end mt-5">
              <IconButton
                sx={{ bgcolor: "#000" }}
                onClick={() => setOpenModal(false)}
              >
                <AiOutlineClose className="text-white" />
              </IconButton>
            </div>
          </div>
          <div className=" mb-[20px]">
            <div>
              <p
                className="text-[16px] font-[500]"
                style={{ letterSpacing: "8px" }}
              >{`${category}  (${year})`}</p>
              <h3 className="text-[60px]">{title}</h3>
              <Link href="/auth/login" >
                <ThemeRegistry color="#ffffff">
                  <Button
                    variant="contained"
                    startIcon={<IoIosPlay />}
                    sx={{ width: "120px", height: "45px" }}
                  >
                    {" "}
                    Play
                  </Button>
                </ThemeRegistry>
              </Link>
            </div>
          </div>
        </div>
      </FsModal>
    </>
  );
};

export default TrendingCard;
