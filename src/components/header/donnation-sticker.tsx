"use client";

import { Button, IconButton } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosHeart } from "react-icons/io";
import useBreakpoint from "@/hooks/useBreakpoints";

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

interface DonationStickerProps {
  onGive?: () => void;
  onDismiss: () => void;
}

const DonationSticker = ({ onGive, onDismiss }: DonationStickerProps) => {
  const reduceMotion = useReducedMotion();
  const { isMobile } = useBreakpoint();

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDismiss();
  };

  return (
    <div className="flex h-[50px] bg-black justify-between items-center gap-3  box-border">
      {/* Decorative layer — must not capture clicks */}
      <div className="pointer-events-none mx-4 flex min-w-0 flex-1 items-center gap-x-2 overflow-hidden md:mx-20">
        <motion.div
          className="relative shrink-0"
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.22, 1],
                }
          }
          transition={{
            duration: 0.85,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-amber-400/30 blur-md"
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: [1, 1.6, 1],
                    opacity: [0.35, 0.7, 0.35],
                  }
            }
            transition={{
              duration: 0.85,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <IoIosHeart className=" text-xl text-amber-400" />
        </motion.div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <motion.p
            className={`text-[13px] leading-snug text-white/95 md:text-[14px] ${
              isMobile ? "flex w-max whitespace-nowrap" : "truncate"
            }`}
            animate={
              isMobile && !reduceMotion
                ? { x: ["0%", "-50%"] }
                : { x: 0 }
            }
            transition={
              isMobile && !reduceMotion
                ? {
                    duration: 12,
                    ease: "linear",
                    repeat: Infinity,
                  }
                : undefined
            }
          >
            <span className={isMobile ? "pr-10" : undefined}>
              Your generosity keeps{" "}
              <b className="font-semibold text-white">FaithStream</b> free for
              10,000 people this month
            </span>
            {isMobile && (
              <span aria-hidden="true" className="pr-10">
                Your generosity keeps{" "}
                <b className="font-semibold text-white">FaithStream</b> free for
                10,000 people this month
              </span>
            )}
          </motion.p>
        </div>
      </div>

      <div className=" md:mr-20 mr-3 flex items-center justify-end gap-x-2 md:gap-x-4">
        <Button
          variant="outlined"
          onClick={onGive}
          sx={{
            height: "30px",
            border: "1px solid #ffffffb7",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "none",
            px: 2,
            pointerEvents: "auto",
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: "#E08FD3",
              backgroundColor: "rgba(112, 31, 99, 0.25)",
            },
          }}
        >
          Give now
        </Button>

        <IconButton type="button" onClick={handleClose}>
          <AiOutlineClose size={18} />
        </IconButton>
      </div>
    </div>
  );
};

export default DonationSticker;
