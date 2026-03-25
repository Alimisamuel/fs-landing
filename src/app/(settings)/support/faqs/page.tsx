"use client";

import Loader from "@/components/UI/Loader";
import { useGetQuery } from "@/hooks/useQuery";
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider } from "@mui/material";
import React from "react";
import { BsChevronDown } from "react-icons/bs";

export interface faqs {
  id: number;
  question: string;
  answer: string;
  status: string;
  createdBy: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
}

interface FaqProps {
  data: {
    data: faqs[];
  };
  message: string;
  status: boolean;
}


const FaqPage = () => {

  const {data, isPending} = useGetQuery<FaqProps>(["faqs"],"/faqs");

  const faqData = data?.data?.data || [];


  return (

    <div className="text-black">
      {
        isPending && <Loader label="Loading Faqs..." />
      }
      <p className="text-[18px] font-bold">Support & Help</p>
      <p className="text-[#667085] text-[14px] mt-1">
        We’re here to make your FaithStream experience smooth, inspiring, and
        worry-free.
      </p>
 
      <Divider sx={{my:3, bgcolor:'#EAECF0'}} />
      <div className=" pt-3">
        <div className="">
          <p className="font-[500]">Frequently Asked Questions (FAQs)</p>
          <p className="text-[14px] text-[#667085]">
            Quick answers to questions we hear most often.
          </p>
        </div>


         <div className="mt-5">
        {faqData.map((f, idx) => (
          <Accordion
            key={idx}
            defaultExpanded={idx == 0}
            sx={{
              borderRadius: "12px",
              mb: 2,

              "&.MuiAccordion-root": {
                background: "transparent",
                boxShadow: "none",
              },
              "&::before": {
                height: 0,
              },
            }}
          >
            <AccordionSummary
              sx={{
                bgcolor: "#FFF",
                border: "1px solid #D7D7D7",
                borderRadius: "8px",
                transition: "0.2s all linear",
                height: "65px",
                px: 4,
                "&.Mui-expanded": {
                  borderRadius: "8px 8px 0px 0px",
                },
              }}
              expandIcon={<BsChevronDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="flex items-center justify-between w-full pr-6">
                <p className="text-black-1 text-[14px] font-[600]">
                  {f.question}
                </p>
            
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <div
                className="bg-[#701F631a] p-5 "
                style={{ borderRadius: "0px 0px 8px 8px" }}
              >
                <p>{f.answer}</p>

             
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
        
      </div>
    </div>
  );
};

export default FaqPage;


