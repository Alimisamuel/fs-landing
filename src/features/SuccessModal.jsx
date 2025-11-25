"use client";

import Image from "next/image";

export default function SuccessModal({ message, close }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close}></div>

      <div className="relative bg-[#181818] rounded-2xl p-8 max-w-md w-full animate-modal-enter shadow-2xl">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          ✕
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Image src="/assets/success.svg" width={50} height={50} alt="success" />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Welcome to the Waitlist! 🎉
          </h3>
          <p className="text-white/90 mb-6 leading-relaxed">{message}</p>

          <button
            onClick={close}
            className="w-full bg-[#701F63] hover:bg-white/30 text-white font-semibold py-3 rounded-[8px] transition-all duration-300 hover:scale-105 border border-white/30"
          >
            Thank you
          </button>
        </div>

        <div className="absolute bottom-0 left-0 h-1 bg-white/30 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
