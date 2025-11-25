"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GrFormNextLink } from "react-icons/gr";

const FormInput = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setTextVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://api.thefaithstream.com/auth/waitlist/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            firstName: "", // Empty string as requested
            lastName: "", // Empty string as requested
          }),
        }
      );

      const data = await response.json();

      if (response.status) {
        setIsSuccess(true);
        setMessage(data.message || "Successfully joined the waitlist!");
        setEmail(""); // Clear the form
        setShowModal(true); // Show success modal

        // Auto-close modal after 4 seconds
        setTimeout(() => {
          setShowModal(false);
        }, 4000);
      } else {
        setIsSuccess(false);
        setMessage(data.error || "Something went wrong. Please try again.");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
      setIsSuccess(false);
      setMessage("Network error. Please check your connection and try again.");
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center mt-10"
      >
        <div className=" w-[382px] relative">
          <input
            type="email"
            placeholder={isLoading ? "Joining waitlist..." : "Enter email here"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="rounded-full w-full h-[50px] px-5 pr-10 border-[1.5px] border-[#FFFFFF40] bg-transparent outline-none focus:ring-0 focus:border-[#FFFFFF40] text-white placeholder-white/70 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 hover:text-[#e08fd3] hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <GrFormNextLink className="text-white text-2xl" />
            )}
          </button>
        </div>
      </form>

      {/* Error Message (inline) */}
      {message && !isSuccess && (
        <div className="text-center mt-6 px-4 py-2 rounded-lg max-w-md mx-auto transition-all duration-300 bg-red-500/20 border border-red-500/30 text-red-300">
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-[#181818] backdrop-blur-lg rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 animate-modal-enter shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                <Image
                  src="/assets/success.svg"
                  alt="icon"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Welcome to the Waitlist! 🎉
              </h3>
              <p className="text-white/90 mb-6 leading-relaxed">{message}</p>
              <p className="text-white/70 text-sm mb-6">
                We&#39ll keep you updated on our progress and let you know as
                soon as FaithStream launches!
              </p>

              {/* Action Button */}
              <button
                onClick={closeModal}
                className="w-full bg-[#701F63] hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[8px] cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
              >
                Thank you
              </button>
            </div>

            {/* Auto-close progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormInput;
