import React from 'react'
import { GiPeaceDove } from 'react-icons/gi'
import { motion } from "framer-motion";

const HeroPage = () => {
  return (
   <>
 <div className="absolute right-[49.4%]">
              <GiPeaceDove className="text-[20px]" />
            </div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="!font-[700] text-center text-[45px] md:text-[90px] md:leading-[100px] mt-10 md:mt-30 leading-[55px] optima "
            >
              Something{" "}
              <span
                className="text-[60px] md:text-[90px]   bg-[url('/assets/line.svg')]
    bg-no-repeat
    bg-[0px_48px] md:bg-[0px_68px]
    bg-[length:300px] md:bg-[length:400px] "
              >
                Faith-Filled
              </span>
              <br />
              Is Coming!
            </motion.h1>
   </>
  )
}

export default HeroPage
