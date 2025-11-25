"use client";
import Image from "next/image";
import HeroPage from "@/features/HeroSection";
import FormInput from "@/features/FormInput";
import Header from "@/features/Header";
import HeroSection from "@/features/HeroSection";
import WaitlistForm from "@/features/FormInput";
import JoinersBadge from "@/features/JoinerBadge";

export default function Home() {
  return (
    <>
      <div className="w-screen h-screen bg-[url('/assets/banner.svg')] bg-cover bg-center bg-black relative overflow-hidden">
      {/* Glowing orbs */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      <div className="glow-orb glow-orb-3"></div>

      <div className="w-full h-full p-10 relative z-10 overflow-y-auto overflow-x-hidden">
        <Header />
        <HeroSection />
        <WaitlistForm />
        <JoinersBadge />
      </div>
    </div>
    </>
  );
}
