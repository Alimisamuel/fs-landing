import { Play } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const ExperienceCard = ({ title, description, imageUrl }: ContentCardProps) => {
  return (
    <article className="group relative w-full cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02]">
      <div
        className="relative aspect-[1.42/1] overflow-hidden bg-[#090611]"
        style={{
          borderRadius: "18px",
          boxShadow:
            "0 0 0 1px rgba(162, 227, 255, 0.34), 0 0 18px rgba(112, 194, 255, 0.24), 0 0 34px rgba(220, 129, 255, 0.2)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,16,42,0.28)_0%,rgba(24,16,42,0.16)_42%,rgba(7,4,15,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(24,16,42,0)_0%,rgba(43,26,64,0.32)_34%,rgba(6,4,14,0.92)_100%)] backdrop-blur-[4px]" />

        <div className="absolute bottom-0 right-0 h-[104px] w-[104px] rounded-tl-[54px] bg-[#07040f] md:h-[114px] md:w-[114px]" />

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 pr-24 md:p-7 md:pr-28">
          <h3 className="font-serif text-[2.15rem] font-bold leading-[0.95] tracking-[-0.045em] text-white md:text-[3rem]">
            {title}
          </h3>
          <p className="mt-3 max-w-[24rem] text-base leading-[1.15] text-white/84 md:text-[1.1rem]">
            {description}
          </p>
        </div>

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="experience-card-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8be4ff" />
              <stop offset="56%" stopColor="#bfc0ff" />
              <stop offset="100%" stopColor="#f29ae5" />
            </linearGradient>
          </defs>
          <path
            d="M3 8
              Q3 3 8 3
              L92 3
              Q97 3 97 8
              L97 51
              Q97 56 92 56
              Q84 56 81 63
              Q80 67 76 67
              L8 67
              Q3 67 3 62
              Z"
            fill="none"
            stroke="url(#experience-card-stroke)"
            strokeWidth="0.55"
            strokeLinejoin="round"
            className="transition-all duration-500 [filter:drop-shadow(0_0_8px_rgba(112,196,255,0.45))] group-hover:[filter:drop-shadow(0_0_15px_rgba(112,196,255,0.75))]"
          />
        </svg>
      </div>

      <button
        type="button"
        aria-label={`Play ${title}`}
        className="absolute bottom-[2px] right-[4px] z-30 flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))] text-white shadow-[0_18px_30px_rgba(0,0,0,0.34),inset_0_1px_1px_rgba(255,255,255,0.24)] backdrop-blur-xl transition-all duration-500 group-hover:border-white/45 group-hover:brightness-125 md:bottom-[6px] md:right-[8px] md:h-[88px] md:w-[88px]"
      >
        <Play className="ml-1 h-8 w-8 fill-white text-white md:h-9 md:w-9" />
      </button>
    </article>
  );
};

export default ExperienceCard;
