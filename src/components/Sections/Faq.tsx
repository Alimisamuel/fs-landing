import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { FaqData } from "@/lib/constants/mock";
import { AiOutlinePlusCircle } from "react-icons/ai";

const Faq = () => {
  return (
    <>
      <h3 className="font-[700] text-[28px] text-center">
        Frequently asked questions
      </h3>
      <p className="text-center">
        Find everything you need to know about streaming and subscriptions.
      </p>
      <div className="w-full mt-5">
        {FaqData.map((faq, index) => (
          <Accordion
            sx={{ bgcolor: "#FFFFFF0D", mb: 2 }}
            key={index}
            defaultExpanded={index === 0}
          >
            <AccordionSummary
              expandIcon={
                <AiOutlinePlusCircle className="text-[20px] text-[#FAFAFA]" />
              }
              sx={{
                borderBottom: "0.5px solid #393939",
                "& .MuiTypography-root": {
                  fontWeight: 500,
                  fontFamily: "satoshi",
                },
              }}
            >
              <Typography>{faq.quest}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.ans}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default Faq;
