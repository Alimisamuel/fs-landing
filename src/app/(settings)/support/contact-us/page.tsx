
import React from "react";
import { PiChatCircleText, PiPhoneCallLight } from "react-icons/pi";
import { HiOutlineMail } from "react-icons/hi";
import { Button, Divider } from "@mui/material";

const page = () => {
  return (
    <div className="text-black">
      <p className="text-[18px] font-bold">Support & Help</p>
      <p className="text-[#667085] text-[14px] mt-1">
        We’re here to make your FaithStream experience smooth, inspiring, and
        worry-free.
      </p>
     
      <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
      <div className="flex flex-row justify-between pt-3">
        <div className="w-[30%]">
          <p className="font-[500]">Contact Us</p>
          <p className="text-[14px] text-[#667085]">
            Still need help? We’re happy to assist you directly.
          </p>
        </div>
        <div className="w-[60%]">
          {ListItems.map((item, idx) => (
            <>
              <div className="flex flex-row items-center justify-between">
                <div key={idx} className="flex flex-row gap-x-4">
                  {item.icon}
                  <div>
                    <p className="font-[500] ">{item.title}</p>
                    <a href={item?.href}>
                    <p className="text-[14px] text-[#667085]">{item.desc}</p></a>
                  </div>
                </div>
                {/* <Button  className="text-primary">
                  {idx === 0
                    ? ""
                    : idx === 1
                    ? "Visit Mail"
                    : "Call Us"}
                </Button> */}
              </div>
              
              <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

const ListItems = [
  {
    title: "Live Chat Support",
    // desc: "Available Mon-Sat, 9AM-7PM",
    desc: "Not available",
    icon: <PiChatCircleText className="text-bold mt-2" />,
  },
  {
    title: "Email Support ",
    href:"mailto:support@ahouseoffaith.org",
    desc: "support@ahouseoffaith.org",
    icon: <HiOutlineMail className="text-bold mt-2" />,
  },
  {
    title: "Call Us",
      // href:"tel:+1 (234) 567-8901",
    desc: "Not available",
    icon: <PiPhoneCallLight className="text-bold mt-2" />,
  },
];
