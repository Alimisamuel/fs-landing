import FlyoutContainer from "@/components/UI/FlyoutContainer";
import { IconButton, Popover, Typography } from "@mui/material";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import React, { FC, ReactNode } from "react";

const ContentLikes = () => {
  return (
    <>
      <FlyoutContainer FlyoutContent={LikesContent}>
        <IconButton
          sx={{
            height: "42px",
            width: "42px",
            border: "2px solid #FFFFFF80",
          }}
        >
          <Image src="/icons/thumbup.svg" alt="thumbs" width={20} height={20} />
        </IconButton>
      </FlyoutContainer>
    </>
  );
};

export default ContentLikes;

const LikesContent = () => {
  return (
    <>
      <div className=" h-[52px] bg-[#232323] rounded-full flex items-center gap-x-3 px-3 w-[150px] justify-center">
        <IconButton>
          <Image src="/icons/dislike.svg" alt="thumbs" width={20} height={20} />
        </IconButton>
        <IconButton>
          <Image src="/icons/thumbup.svg" alt="thumbs" width={20} height={20} />
        </IconButton>
        <IconButton>
          <Image
            src="/icons/2thumbup.svg"
            alt="thumbs"
            width={20}
            height={20}
          />
        </IconButton>
      </div>
    </>
  );
};
