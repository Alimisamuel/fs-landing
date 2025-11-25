"use client";
import Image from "next/image";
import HeroPage from "@/features/Home";
import FormInput from "@/features/FormInput";

export default function Home() {
  return (
    <>
      <div className="w-screen h-screen bg-[url('/assets/banner.svg')] bg-cover bg-center bg-black relative overflow-hidden ">
        {/* Animated background particles */}

        {/* Glowing orbs */}
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>

        <div className="w-full h-full p-10 relative z-10 overflow-y-auto overflow-x-hidden ">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/assets/logo.svg"
              alt="logo"
              width={200}
              height={200}
              className="w-40 md:w-55"
            />
            <div className="center-box ml-30 hidden md:block">
              <div className="animated-border-box-glow"></div>
              <div className="animated-border-box"></div>
            </div>
          </div>

          <div className="text-container-main">
            <HeroPage />

            <p className="text-center mt-20 md:mt-30">
              Be the first to know when we launch, enter your email to get
              exclusive updates
              <br /> and early access.
            </p>
            <div className="flex items-center justify-center mt-6">
              <a
                href="https://flutterwave.com/donate/mrcxdtkmwg1u"
                target="_blank"
              >
                <button className="button text-[14px] bg-white px-4 py-3 rounded-full w-[150px] text-black flex items-center gap-x-3 justify-center font-[600] cursor-pointer">
                  {" "}
                  <Image
                    src="/assets/donation.svg"
                    alt="give_icon"
                    width={20}
                    height={20}
                  />{" "}
                  GIVE
                </button>
              </a>
            </div>
            <FormInput />

            <div className="flex justify-center md:ml-140 ml-80">
              <div className="center-box">
                <div className="animated-border-box-glow"></div>
                <div className="animated-border-box"></div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-x-4 mt-10">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[url('/assets/a1.png')] bg-center bg-cover border-3 border-black" />
                <div
                  className="w-8 h-8 rounded-full bg-[url('/assets/a2.png')] bg-center bg-cover border-3 border-black "
                  style={{ marginLeft: "-12px" }}
                />
                <div
                  className="w-8 h-8 rounded-full bg-[url('/assets/a3.png')] bg-center bg-cover border-3 border-black"
                  style={{ marginLeft: "-12px" }}
                />
              </div>
              <p className="text-[14px]">Join 10,000+ already onboard</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
