"use client";

import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation"; // ✅ Correct one for App Router

import { Button, Divider, IconButton, TextField } from "@mui/material";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";

import { supportTopics } from "@/lib/constants/mock";

const SupportTopicOverview = ({ id }: { id: string }) => {
  const router = useRouter();
  const currentTopic = supportTopics.find((item) => item.topic === id);

  if (!currentTopic) {
    return (
      <div>
        Topic not found <p>{id}</p>
      </div>
    );
  }
  return (
    <div className="text-black">
      <div
        onClick={() => router.push("/support")}
        className="text-black flex flex-row items-center gap-x-1 cursor-pointer mb-4"
      >
        <IoIosArrowRoundBack className="text-xl" />
        <p className="hover:underline text-[#667085]">Go Back</p>
      </div>

      <p className="text-[18px] font-medium">{id}</p>
      <Divider sx={{my:3}} />
      <div
        className="text-[#667085] text-[14px]"
        dangerouslySetInnerHTML={{ __html: currentTopic.content }}
      />

      <div className="mt-20">
        <p className="font-medium text-center">
          Was this article helpful? Tell us what you think..
        </p>
        <div className="flex flex-row items-center gap-x-7 justify-center mt-4">
          <div className="flex flex-row items-center gap-x-2.5">
            <IconButton sx={{ border: "1px solid #667085" }}>
              <BiSolidLike className="text-[#667085]" />
            </IconButton>
            <p className="text-[#667085]">Yes</p>
          </div>
          <div className="flex flex-row items-center gap-x-2.5">
            <IconButton sx={{ border: "1px solid #667085" }}>
              <BiSolidDislike className="text-[#667085]" />
            </IconButton>
            <p className="text-[#667085]">No</p>
          </div>
        </div>

        <div className="mx-auto mt-7 w-[80%] flex flex-row items-center gap-x-3.5">
          <TextField placeholder="Leave a comment" fullWidth sx={{ flex: 1 }} />
          <Button variant="contained" className="h-[55px] rounded-[4px] w-[150px]">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default SupportTopicOverview;
