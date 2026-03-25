import { Skeleton } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { HomeHeader } from "../header";

const TileLoader = ({hideHeader}:{hideHeader?:boolean}) => {
  return (
    <div className="pt-[200px] w-[95vw] mx-auto aspect-video ">
      {
        !hideHeader &&   <HomeHeader />
      }
    
      <div className="mb-2">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ width: "120px", height: "10px" }}
        />
      </div>
      <div className="flex items-center gap-x-1.5 ">
        {[...Array(5)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className=" flex-shrink-0"
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{ width: "220px", height: "120px" }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TileLoader;
