import { useCardContext } from "@/contexts/CardContext";
import { ContentItem } from "@/services/bannerApi";
import { LinearProgress, styled } from "@mui/material";
import Image from "next/image";
import React, { FC, useRef, useEffect } from "react";
import Ring from "../Sections/Ring";
import useBreakpoint from "@/hooks/useBreakpoints";
import { useRouter } from "next/navigation";
import { useMovieContext } from "@/contexts/MovieContext";

interface CardProps {
  item: ContentItem;
  watching?: boolean;
  autoWidth?: boolean;
  isTop10?: boolean;
  index?: string;
  isRecent?: boolean;
}

const GradientLinearProgress = styled(LinearProgress)(({}) => ({
  height: 3,
  borderRadius: 0,
  background: " #FFFFFF59",
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 0,
    background: "linear-gradient(180deg, #6EBDE4 0%, #E08FD3 100%)",

    // your gradient
  },
}));

const MovieCard: FC<CardProps> = ({
  item,
  watching,
  autoWidth = false,
  isTop10,
  index,
  isRecent,
}) => {
  const { cardState, setCardState } = useCardContext();

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (cardState.cardId === item.id && cardState.isHovered) {
      return;
    }

    // Clear any existing timeout
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    const cardElement = e.currentTarget as HTMLElement;
    const cardRect = cardElement.getBoundingClientRect();

    hoverTimeout.current = setTimeout(() => {
      setCardState({
        item,
        isHovered: true,
        cardId: item.id ?? 0,
        postion: { x: cardRect.left + cardRect.width / 2, y: cardRect.top },
      });
    }, 500); // 500ms delay before showing popup
  };
  const { setSelectedMovie } = useMovieContext();

  const handleMouseLeave = () => {
    // Clear the timeout if mouse leaves before delay completes
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    // Don't immediately hide the popup here - let the popup handle its own mouse leave
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const { isMobile } = useBreakpoint();

  const thumbnails = isMobile ? item?.mobileThumbnails : item?.thumbnailUrls;
  const thumbnail =
    thumbnails.length === 0 ? "/images/thumbnail_fallback.jpeg" : thumbnails[0];

  const router = useRouter();

  const handleMobileClick = (id: string) => {
    router.push(`/browse/content/${id}`);
    setSelectedMovie(item);
  };

  return (
    <>
      {isMobile ? (
        <div
          onClick={() => handleMobileClick(item?.id)}
          className={`rounded-[4px] flex flex-col justify-between shadow-lg bg-gradient-to-b from-primary/50 to-black cursor-pointer h-[253px] ${
            thumbnail ? "bg-cover bg-center" : ""
          } overflow-hidden ${autoWidth ? "w-auto" : "w-[168px]"}`}
          style={
            thumbnail
              ? {
                  backgroundImage: ` url(${thumbnail})`,
                }
              : {}
          }
          role="presentation"
        >
          <div className="p-2 flex-row flex justify-between">
            <Image src="/logo/Group.svg" alt="Logo" width={30} height={30} />

            {item.isInTopTen && (
              <div
                className=" bg-primary text-white text-xs font-semibold px-1 py-2 mt-[-10px] mr-[-10px]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
                }}
              >
                <p className="text-[10px]">TOP </p>
                <p className="font-[900] text-center">10</p>
              </div>
            )}
          </div>
          {isTop10 ? (
            <div style={{ marginBottom: "5px", paddingLeft: "6px" }}>
              <Ring space="w-[40px] h-[40px]">
                <div className="w-[34px] h-[34px] flex items-center justify-center">
                  <p className="font-[700]">{index}</p>
                </div>
              </Ring>
            </div>
          ) : (
            <>
              {/* {(item?.isTrending || item?.isNew) && (
              <div className="w-full">
                <div
                  className="bg-primary text-white text-center py-1 text-xs font-medium w-fit mx-auto px-1.5 "
                  style={{ borderRadius: "4px 4px 0px 0px" }}
                >
                  {item?.isNew ? "Recently Added" : "Leaving Soon"}
                </div>
              </div>
            )} */}
            </>
          )}
        </div>
      ) : (
        <div
          className={`rounded-[4px] flex flex-col justify-between shadow-lg bg-gradient-to-b from-primary/50 to-black cursor-pointer h-[123px] ${
            thumbnail ? "bg-cover bg-center" : ""
          } overflow-hidden ${autoWidth ? "w-auto" : "w-[218px]"}`}
          style={
            thumbnail
              ? {
                  backgroundImage: ` url(${thumbnail})`,
                }
              : {}
          }
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          role="presentation"
        >
          <div className="p-2 flex-row flex justify-between">
            <Image src="/logo/Group.svg" alt="Logo" width={30} height={30} />

            {item.isInTopTen && (
              <div
                className=" bg-primary text-white text-xs font-semibold px-1 py-2 mt-[-10px] mr-[-10px]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
                }}
              >
                <p className="text-[10px]">TOP </p>
                <p className="font-[900] text-center">10</p>
              </div>
            )}
          </div>
          {isTop10 ? (
            <div style={{ marginBottom: "5px", paddingLeft: "6px" }}>
              <Ring space="w-[40px] h-[40px]">
                <div className="w-[34px] h-[34px] flex items-center justify-center">
                  <p className="font-[700]">{index}</p>
                </div>
              </Ring>
            </div>
          ) : (
            <>
              {/* {(item?.isTrending || item?.isNew) && (
              <div className="w-full">
                <div
                  className="bg-primary text-white text-center py-1 text-xs font-medium w-fit mx-auto px-1.5 "
                  style={{ borderRadius: "4px 4px 0px 0px" }}
                >
                  {item?.isNew ? "Recently Added" : "Leaving Soon"}
                </div>
              </div>
            )} */}
            </>
          )}
        </div>
      )}

      {(watching || item?.progressPercentage) && (
        <div className=" mt-1 w-[60%] mx-auto">
          <GradientLinearProgress
            variant="determinate"
            value={item?.progressPercentage}
          />
        </div>
      )}
    </>
  );
};

export default MovieCard;
