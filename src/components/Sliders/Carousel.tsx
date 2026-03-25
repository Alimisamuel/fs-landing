import { FC, useRef, useState, useEffect } from "react";
import MovieCard from "../cards/MovieCard";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { ContentItem } from "@/services/bannerApi";
import { VideoWithRecentFlag } from "@/utils/videoProcessing";
import { motion } from "framer-motion";
import { Skeleton } from "@mui/material";

interface CarouselProps {
  title: string;
  items: VideoWithRecentFlag[];
  watching?: boolean;
  isTop10?: boolean;
  isLoading?: boolean;
}

const Carousel: FC<CarouselProps> = ({
  title,
  items,
  watching,
  isTop10,
  isLoading,
}) => {
  const carouselContainer = useRef<HTMLDivElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const scrollAmount: number = 320;



  useEffect(() => {
    const updateCanScrollRight = () => {
      if (carouselContainer.current) {
        const container = carouselContainer.current;
        setCanScrollRight(
          container.scrollLeft + container.clientWidth < container.scrollWidth,
        );
      }
    };

    updateCanScrollRight();
    const resizeObserver = new ResizeObserver(updateCanScrollRight);
    if (carouselContainer.current) {
      resizeObserver.observe(carouselContainer.current);
    }

    return () => resizeObserver.disconnect();
  }, [scrollPosition]);

  const scrollLeft = () => {
    if (carouselContainer.current) {
      const newPosition = Math.max(0, scrollPosition - scrollAmount);
      setScrollPosition(newPosition);
      carouselContainer.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselContainer.current) {
      const newPosition = scrollPosition + scrollAmount;
      setScrollPosition(newPosition);
      carouselContainer.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (carouselContainer.current) {
      setScrollPosition(carouselContainer.current.scrollLeft);
    }
  };

  return (
    <div
      className="w-[95vw] ml-auto"
      style={{
        width: scrollPosition > 0 ? "100vw" : "95vw",
        transition: "0.1s all linear",
      }}
    >
      <p className="mt-4 mb-4 text-white font-[500]">{title}</p>
      <div className="relative scrollbar-none hide_scrollbar">
        {scrollPosition > 0 && (
          <button
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={scrollLeft}
            className="absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-4 cursor-pointer z-10 transition-colors duration-300 ease-in-out hover:bg-opacity-80 left-0 h-full"
          >
            <BsChevronLeft />
          </button>
        )}
        {canScrollRight && (
          <button
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={scrollRight}
            className="absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white border-none p-4 cursor-pointer z-10 transition-colors duration-300 ease-in-out hover:bg-opacity-80 right-0 h-full"
          >
            <BsChevronRight />
          </button>
        )}
        <div
          ref={carouselContainer}
          className="overflow-x-auto flex gap-1.5 scroll-snap-x-mandatory scrollbar-none hide_scrollbar "
          onScroll={handleScroll}
        >
          {isLoading
            ? [...Array(7)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className=" flex-shrink-0"
                >
                  <Skeleton variant="rectangular" animation="wave" sx={{width:'220px', height:'120px'}}/>
                  </motion.div>
              ))
            : items.map((item, idx) => (
                <motion.div
                  // className="scroll-snap-center flex-none mr-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  key={idx}
                >
                  <MovieCard
                    isRecent={item?.isRecent}
                    isTop10={isTop10}
                    item={item}
                    watching={watching}
                    index={`${idx + 1}`}
                  />
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
