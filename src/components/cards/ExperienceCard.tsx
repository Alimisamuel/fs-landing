"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  /** 0-based order for staggered grid entrance */
  entranceIndex?: number;
}

/** 385×300 frame, 8px main corner radius, top-right “bubble” cutout */
const CARD_PATH =
  "M384.521 228.882C384.521 234.238 378.779 237.81 373.534 236.725C370.6 236.118 367.566 235.8 364.46 235.8C338.945 235.8 318.261 257.29 318.261 283.8C318.261 285.963 318.399 288.094 318.666 290.181C319.295 295.088 315.806 300 310.86 300H8C3.58186 300 0 296.418 0 292V8C0 3.58173 3.58161 0 8 0H376.521C380.939 0 384.521 3.58161 384.521 8V228.882Z";

const ExperienceCard = ({
  title,
  description,
  imageUrl,
  entranceIndex = 0,
}: ContentCardProps) => {
  const uid = useId().replace(/:/g, "");
  const clipId = `experience-card-clip-${uid}`;
  const gradientId = `experience-card-outline-${uid}`;
  const reduceMotion = useReducedMotion();
  const baseDelay = entranceIndex * 0.15;
  const clipUrl = `url(#${clipId})`;
  /** Duplicate on the scaling layer so cover+scale cannot paint past the border (WebKit + subpixel). */
  const clipStyle = {
    clipPath: clipUrl,
    WebkitClipPath: clipUrl,
  } as const;

  return (
    <motion.article
      className="group relative mx-auto w-full max-w-[384.52px] cursor-pointer overflow-visible [container-type:inline-size]"
      initial={
        reduceMotion ? false : { opacity: 0, y: 52, scale: 0.92, rotate: -0.8 }
      }
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 72,
              damping: 22,
              mass: 0.92,
              delay: baseDelay,
            }
      }
    >
      <svg className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={CARD_PATH} />
          </clipPath>
        </defs>
      </svg>

      <motion.div
        className="relative aspect-[385/300] w-full transition-transform duration-500 ease-out group-hover:scale-[1.01]"
        initial={
          reduceMotion ? false : { filter: "blur(14px) saturate(0.88)" }
        }
        animate={{ filter: "blur(0px) saturate(1)" }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                delay: baseDelay + 0.06,
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
              }
        }
      >
        <div
          className="absolute inset-0 isolate overflow-hidden"
          style={clipStyle}
        >
          <div
            className="absolute inset-0 origin-center bg-[lightgray] bg-no-repeat transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
            style={{
              ...clipStyle,
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
          <div className="relative z-10 flex h-full min-h-0 flex-col justify-end">
            <div className="relative w-full min-w-0">
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent backdrop-blur-sm md:backdrop-blur-xs"
                aria-hidden="true"
              />
              <motion.div
                className="relative z-10 pt-[clamp(1rem,5.2cqw,1.5rem)] pb-[clamp(1rem,5.2cqw,1.5rem)] pl-[clamp(1rem,5.2cqw,1.5rem)] pr-[clamp(4.25rem,18.5cqw,6.25rem)]"
                initial={reduceMotion ? "show" : "hidden"}
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.1,
                      delayChildren: reduceMotion ? 0 : baseDelay + 0.28,
                    },
                  },
                }}
              >
                <motion.h3
                  className="mb-[clamp(0.375rem,1.25cqw,0.5rem)] font-serif text-[clamp(1.25rem,6.2cqw,1.5rem)] font-bold leading-none tracking-[-0.04em] text-white"
                  variants={{
                    hidden: reduceMotion
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 22, filter: "blur(8px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.7,
                            ease: [0.19, 1, 0.22, 1],
                          },
                    },
                  }}
                >
                  {title}
                </motion.h3>
                <motion.p
                  className="max-w-[24rem] pt-[clamp(0.85rem,3.2cqw,1.25rem)] text-[clamp(0.8125rem,3.8cqw,0.875rem)] leading-[1.15] text-[#DCDCDC] line-clamp-2 break-words"
                  title={description}
                  variants={{
                    hidden: reduceMotion
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 18, filter: "blur(6px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.65,
                            ease: [0.19, 1, 0.22, 1],
                          },
                    },
                  }}
                >
                  {description}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 385 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="192.26"
              y1="0"
              x2="192.26"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop className="experience-card-stroke-stop-a" stopColor="#6EBDE4" />
              <stop
                className="experience-card-stroke-stop-b"
                offset="1"
                stopColor="#E08FD3"
              />
            </linearGradient>
          </defs>
          <motion.path
            d={CARD_PATH}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinejoin="round"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    pathLength: {
                      delay: baseDelay + 0.18,
                      duration: 1.28,
                      ease: [0.42, 0, 0.15, 1],
                    },
                    opacity: {
                      delay: baseDelay + 0.12,
                      duration: 0.4,
                      ease: "easeOut",
                    },
                  }
            }
            className="transition-[filter] duration-500 [filter:drop-shadow(0_0_8px_rgba(110,189,228,0.35))] group-hover:[filter:drop-shadow(0_0_14px_rgba(224,143,211,0.45))]"
          />
        </svg>
      </motion.div>

      <motion.button
        type="button"
        aria-label={`Play ${title}`}
        className="absolute bottom-[clamp(-0.5rem,-2.1cqw,-0.35rem)] right-0 z-20 flex size-[clamp(2.75rem,14.5cqw,3.5rem)] items-center justify-center rounded-full border border-white bg-[linear-gradient(165deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_100%)] shadow-[0_10px_28px_rgba(0,0,0,0.45),0_0_0_1px_rgba(110,189,228,0.2)_inset] backdrop-blur-md transition-[filter,box-shadow] duration-300 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(224,143,211,0.25)_inset] active:scale-[0.98] group-hover:brightness-110"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.35, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 380,
                damping: 22,
                delay: baseDelay + 0.52,
              }
        }
      >
        <Play
          className="ml-0.5 size-[clamp(1rem,5.2cqw,1.25rem)] fill-white text-white"
          strokeWidth={1.75}
        />
      </motion.button>
    </motion.article>
  );
};

export default ExperienceCard;
