"use client";
import { motion } from "framer-motion";
import { GiPeaceDove } from "react-icons/gi";

export default function HeroSection() {
  return (
    <div className="text-container-main">
      <div className="absolute right-[49.4%]">
        <GiPeaceDove className="text-[20px]" />
      </div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="!font-[700] text-center text-[45px] md:text-[90px] md:leading-[100px] mt-10 md:mt-30 leading-[55px] optima"
      >
        Something{" "}
        <span
          className="text-[60px] md:text-[90px] bg-[url('/assets/line.svg')]
          bg-no-repeat bg-[0px_48px] md:bg-[0px_68px]
          bg-[length:300px] md:bg-[length:400px]"
        >
          Faith-Filled
        </span>
        <br />
        Is Coming!
      </motion.h1>

      <p className="text-center mt-20 md:mt-30">
        Be the first to know when we launch, enter your email to get
        exclusive updates <br /> and early access.
      </p>

      <div className="flex items-center justify-center mt-6">
        <a
          href="https://flutterwave.com/donate/mrcxdtkmwg1u"
          target="_blank"
        >
          <button className="button text-[14px] bg-white px-4 py-3 rounded-full w-[150px] text-black flex items-center gap-x-3 justify-center font-[600] cursor-pointer">
            <img src="/assets/donation.svg" className="w-5" />
            GIVE
          </button>
        </a>
      </div>
    </div>
  );
}
