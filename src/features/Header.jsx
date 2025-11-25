"use client";
import Image from "next/image";

export default function Header() {
  return (
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
  );
}
