/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import HomeBanner from "@/components/Banners/HomeBanner";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import Carousel from "@/components/Sliders/Carousel";

import Footer from "@/components/Sections/Footer";
import { useContentCategoryData} from "@/hooks/useBannerData";
import { processCategoriesWithRecentFlags } from "@/utils/videoProcessing";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { HomeHeader } from "@/components/header";
import SearchResults from "../SearchResults";

const BrowsePage = () => {
  const {
    data: contentCategoryData,
    isLoading: contentCategoryLoading,
    error: contentCategoryError,
  } = useContentCategoryData();

 

  // Process categories and add isRecent flags to all videos
  const processedCategories = processCategoriesWithRecentFlags(
    contentCategoryData?.data?.data || [],
  );

  const other_categories = processedCategories?.filter(
    (c: any) => c.categoryName !== "Popular Movies",
  );

  const query = useSearchQuery();
  
  return (

  
    <>
      <HomeHeader />
     

<AnimatePresence mode="wait">
  {query ? (
    <motion.div
      key="search"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <SearchResults />
    </motion.div>
  ) : (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <HomeBanner />

      {other_categories
        ?.filter((cat: any) => cat?.videos?.length > 0)
        ?.map((cat: any, idx: number) => {
          const isTop10 = cat?.categoryName === "TOP 10";
          const IsContinue =
            cat?.categoryName === "Continue Watching";

          return (
            <div className="mt-15" key={idx}>
              <Carousel
                title={
                  isTop10
                    ? "Top 10 movies in Nigeria Today"
                    : cat?.categoryName
                }
                isTop10={isTop10}
                items={cat?.videos ?? []}
                watching={IsContinue}
                isLoading={contentCategoryLoading}
              />
            </div>
          );
        })}
    </motion.div>
  )}
</AnimatePresence>


      <Footer />

      {/* <MoodCard /> */}
    </>
  );
};

export default BrowsePage;
