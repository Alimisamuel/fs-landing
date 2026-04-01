"use client";

import { useCallback, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  groupId: string;
  isSelected: boolean;
  onSelect: (groupId: string) => void;
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
  groupId,
  isSelected,
  onSelect,
  entranceIndex = 0,
}: ContentCardProps) => {
  const uid = useId().replace(/:/g, "");
  const clipId = `experience-card-clip-${uid}`;
  const gradientId = `experience-card-outline-${uid}`;
  const reduceMotion = useReducedMotion();
  const baseDelay = entranceIndex * 0.15;
  const clipUrl = `url(#${clipId})`;

  const handleSelect = useCallback(() => {
    onSelect(groupId);
  }, [groupId, onSelect]);

  const selectionSpring = reduceMotion
    ? { duration: 0.2, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.88 };

  /** Duplicate on the scaling layer so cover+scale cannot paint past the border (WebKit + subpixel). */
  const clipStyle = {
    clipPath: clipUrl,
    WebkitClipPath: clipUrl,
  } as const;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[384.52px]"
      initial={
        reduceMotion ? false : { opacity: 0, y: 52, scale: 0.92, rotate: -0.8 }
      }
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              opacity: {
                delay: baseDelay,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              },
              y: {
                delay: baseDelay,
                type: "spring",
                stiffness: 72,
                damping: 22,
                mass: 0.92,
              },
              scale: {
                delay: baseDelay,
                type: "spring",
                stiffness: 72,
                damping: 22,
                mass: 0.92,
              },
              rotate: {
                delay: baseDelay,
                type: "spring",
                stiffness: 72,
                damping: 22,
                mass: 0.92,
              },
            }
      }
    >
      <motion.article
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={`Select ${title} experience`}
        className="group relative w-full cursor-pointer overflow-visible [container-type:inline-size]"
        onClick={handleSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleSelect();
          }
        }}
        initial={false}
        animate={{
          y: isSelected ? -7 : 0,
          scale: isSelected ? 1.028 : 1,
          boxShadow: isSelected
            ? "0 22px 44px -12px rgba(110, 189, 228, 0.38), 0 0 0 1px rgba(110, 189, 228, 0.5), 0 0 36px -6px rgba(224, 143, 211, 0.22)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{
          y: selectionSpring,
          scale: selectionSpring,
          boxShadow: selectionSpring,
        }}
      >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[18px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 38%, rgba(110,189,228,0.5) 0%, rgba(224,143,211,0.22) 42%, transparent 68%)",
        }}
        initial={false}
        animate={{
          opacity: isSelected ? 1 : 0,
          scale: isSelected ? 1 : 0.88,
        }}
        transition={selectionSpring}
      />
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
          reduceMotion ? false : { filter: "blur(14px) saturate(0.88)", scale: 1 }
        }
        animate={{
          filter: "blur(0px) saturate(1)",
          scale: reduceMotion ? 1 : isSelected ? 1.012 : 1,
        }}
        transition={{
          filter: reduceMotion
            ? { duration: 0 }
            : {
                delay: baseDelay + 0.06,
                duration: 0.95,
                ease: [0.16, 1, 0.3, 1],
              },
          scale: selectionSpring,
        }}
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
            strokeLinejoin="round"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              strokeWidth: isSelected ? 3.85 : 3,
              filter: isSelected
                ? "drop-shadow(0 0 14px rgba(110,189,228,0.75)) drop-shadow(0 0 28px rgba(224,143,211,0.45))"
                : "drop-shadow(0 0 8px rgba(110,189,228,0.35))",
            }}
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
                    strokeWidth: selectionSpring,
                    filter: { duration: 0.45, ease: [0.22, 1, 0.4, 1] },
                  }
            }
            className="group-hover:[filter:drop-shadow(0_0_14px_rgba(224,143,211,0.45))]"
          />
        </svg>
      </motion.div>

      <motion.button
        type="button"
        aria-label={`Play ${title}`}
        className="absolute bottom-[clamp(-0.5rem,-2.1cqw,-0.35rem)] right-0 z-20 flex size-[clamp(2.75rem,14.5cqw,3.5rem)] items-center justify-center rounded-full border border-white bg-[linear-gradient(165deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_100%)] shadow-[0_10px_28px_rgba(0,0,0,0.45),0_0_0_1px_rgba(110,189,228,0.2)_inset] backdrop-blur-md transition-[filter,box-shadow] duration-300 hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(224,143,211,0.25)_inset] active:scale-[0.98] group-hover:brightness-110"
        onClick={(event) => {
          event.stopPropagation();
          handleSelect();
        }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.35, y: 20 }}
        animate={{
          opacity: 1,
          scale: isSelected ? 1.07 : 1,
          y: 0,
        }}
        whileHover={
          reduceMotion ? undefined : { scale: isSelected ? 1.09 : 1.06 }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 380,
                damping: 22,
                delay: baseDelay + 0.52,
                scale: selectionSpring,
              }
        }
      >
        <Play
          className="ml-0.5 size-[clamp(1rem,5.2cqw,1.25rem)] fill-white text-white"
          strokeWidth={1.75}
        />
      </motion.button>
    </motion.article>
    </motion.div>
  );
};

export default ExperienceCard;
