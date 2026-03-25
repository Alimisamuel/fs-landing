"use client";

import TileLoader from "@/components/UI/TileLoader";
import { usePostMutation } from "@/hooks/useQuery";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import MovieCard from "@/components/cards/MovieCard";
import { Grid, Toolbar } from "@mui/material";
import { ContentItem } from "@/services/bannerApi";

interface payload {
  query: string;
  limit: number;
  contentTypeId?: string;
}

interface SearchResponse {
  data: {
    results: ContentItem[];
  };
  status: string;
}
const SearchResults = ({content_id}:{content_id?:string}) => {
  const query = useSearchQuery();

  const { mutate, isPending, data } = usePostMutation<SearchResponse, payload>(
    `/content/advanced-search`,
    false,
    ["search", query],
  );

  useEffect(() => {
    if (!query || query.length < 2) return;

mutate({
  query: query,
  limit: 50,
  ...(content_id && { contentTypeId: content_id  }),
});
  }, [query]);

  const searchedResults = data?.data?.results || [];



  if (isPending) return <TileLoader hideHeader />;

  return (
    <div className="bg-black min-h-screen">
      <Toolbar />
      <div className="w-[95%] md:w-[85%] mx-auto pt-[90px]">
        <Grid container spacing={2}>
          {searchedResults?.map((content, idx) => (
            <Grid size={{ md: 2.3, xl: 2, xs:4 }}   key={idx}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                key={idx}
              >
                <MovieCard
                  autoWidth
                  // isRecent={content?.isRecent}
                  // isTop10={isTop10}
                  item={content}
                  // watching={watching}
                  index={`${idx + 1}`}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default SearchResults;
