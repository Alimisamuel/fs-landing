
import { supportTopics } from "@/lib/constants/mock";
import { Button, Divider } from "@mui/material";
import Link from "next/link";
import React from "react";

import { RiLightbulbFlashLine } from "react-icons/ri";

const page = () => {
  return (
    <>
      <div className="text-black">
        <p className="text-[18px] font-bold">Support & Help</p>
        <p className="text-[#667085] text-[14px] mt-1">
          We’re here to make your FaithStream experience smooth, inspiring, and
          worry-free.
        </p>
  
        <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
        <div className="flex flex-row justify-between pt-3">
          <div className="w-[30%]">
            <p className="font-[500]">Browse Help Topic</p>
            <p className="text-[14px] text-[#667085]">
              Easily explore guides and solutions to common questions.
            </p>
          </div>
          <div className="w-[60%]">
            {supportTopics.map((item, idx) => (
              <>
              <div className="flex flex-row items-center justify-between">
                <div key={idx} className="flex flex-row gap-x-4">
                  <RiLightbulbFlashLine className="text-bold mt-2" />
                  <div>
                    <p className="font-[500] ">{item.topic}</p>
                    <p className="text-[14px] text-[#667085]">{item.desc}</p>
                  </div>
                </div>
                <Link href={`/support/${item.topic}`} >
                <Button  className="text-primary">Read More</Button></Link>

                </div>
        
                <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
