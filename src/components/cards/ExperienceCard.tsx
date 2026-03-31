import { useId } from "react";
import { Play } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

/** 385×300 frame, 8px main corner radius, top-right “bubble” cutout */
const CARD_PATH =
  "M384.521 228.882C384.521 234.238 378.779 237.81 373.534 236.725C370.6 236.118 367.566 235.8 364.46 235.8C338.945 235.8 318.261 257.29 318.261 283.8C318.261 285.963 318.399 288.094 318.666 290.181C319.295 295.088 315.806 300 310.86 300H8C3.58186 300 0 296.418 0 292V8C0 3.58173 3.58161 0 8 0H376.521C380.939 0 384.521 3.58161 384.521 8V228.882Z";

const ExperienceCard = ({
  title,
  description,
  imageUrl,
}: ContentCardProps) => {
  const uid = useId().replace(/:/g, "");
  const clipId = `experience-card-clip-${uid}`;
  const gradientId = `experience-card-outline-${uid}`;

  return (
    <article className="group cursor-pointer relative mx-auto w-full max-w-[384.52px] overflow-visible">
      <svg className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={CARD_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="relative mx-auto h-[300px] w-full max-w-[384.52px] transition-transform duration-500 ease-out group-hover:scale-[1.01]">
        <div
          className="absolute inset-0"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <div
            className="absolute inset-0 bg-[lightgray] bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{
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
              <div className="relative z-10 p-5 pr-[5.5rem] md:px-6 md:pr-[6.25rem]">
                <h3 className=" mb-2 font-serif text-[2rem] leading-0 font-bold tracking-[-0.04em] text-white md:text-[24px]">
                  {title}
                </h3>
                <p
                  className="!pt-5 max-w-[24rem] text-sm leading-[1.15] text-[#DCDCDC] line-clamp-2 break-words md:text-[14px]"
                  title={description}
                >
                  {description}
                </p>
              </div>
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
          <path
            d={CARD_PATH}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinejoin="round"
            className="transition-all duration-500 [filter:drop-shadow(0_0_8px_rgba(110,189,228,0.35))] group-hover:[filter:drop-shadow(0_0_14px_rgba(224,143,211,0.45))]"
          />
        </svg>
      </div>

      <button
        type="button"
        aria-label={`Play ${title}`}
        className="absolute bottom-[-8px] right-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white bg-[linear-gradient(165deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_100%)] shadow-[0_10px_28px_rgba(0,0,0,0.45),0_0_0_1px_rgba(110,189,228,0.2)_inset] backdrop-blur-md transition-[transform,filter,box-shadow] duration-300 hover:scale-[1.04] hover:shadow-[0_14px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(224,143,211,0.25)_inset] active:scale-[0.98] group-hover:brightness-110 md:bottom-[-8px] md:-right-[7px] md:h-14 md:w-14"
      >
        <Play
          className="ml-0.5 h-[1.125rem] w-[1.125rem] fill-white text-white md:h-5 md:w-5"
          strokeWidth={1.75}
        />
      </button>
    </article>
  );
};

export default ExperienceCard;
