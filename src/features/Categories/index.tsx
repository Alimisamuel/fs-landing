/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import CategoryBanner from "@/components/Banners/CategoryBanner";
import Footer from "@/components/Sections/Footer";
import Carousel from "@/components/Sliders/Carousel";
import { useContentCategoryData } from "@/hooks/useBannerData";
import { useContentCategories } from "@/hooks/useContentCategories";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { processCategoriesWithRecentFlags } from "@/utils/videoProcessing";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";
import SearchResults from "../SearchResults";
import { AnimatePresence, motion } from "framer-motion";
import { HomeHeader } from "@/components/header";

const Categories = () => {
  const params = useParams();
  const nav = decodeURIComponent(params.nav as string);

  const { selectedCategory } = useContentCategories(nav);

  const {
    data: contentCategoryData,
    isFetching: contentCategoryLoading,
    error: contentCategoryError,
  } = useContentCategoryData(20, selectedCategory?.id || "");

  const processedCategories = processCategoriesWithRecentFlags(
    contentCategoryData?.data?.data || [],
  );

  const other_categories = processedCategories?.filter(
    (c: any) => c.categoryName !== "Popular Movies",
  );
  const query = useSearchQuery();


  console.log(contentCategoryData, nav)

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
            <SearchResults content_id={selectedCategory?.id} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <CategoryBanner category={nav} />
            <Box>
              {other_categories
                ?.filter((cat: any) => cat?.videos?.length > 0)
                .slice(0)
                .map((cat: any, idx: number) => {
                  const isTop10 = cat?.categoryName === "TOP 10";
                  const IsContinue = cat?.categoryName === "Continue Watching";

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
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default Categories;
