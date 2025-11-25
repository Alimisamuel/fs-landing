"use client";

import { useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
import SuccessModal from "./SuccessModal";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            firstName: "",
            lastName: "",
          }),
        }
      );

      const data = await response.json();

      if (response.status) {
        setIsSuccess(true);
        setMessage(data.message || "Successfully joined the waitlist!");
        setEmail("");
        setShowModal(true);

        setTimeout(() => setShowModal(false), 4000);
      } else {
        setIsSuccess(false);
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center mt-10"
      >
        <div className="w-[382px] relative">
          <input
            type="email"
            placeholder={isLoading ? "Joining waitlist..." : "Enter email here"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="rounded-full w-full h-[50px] px-5 pr-10 border-[1.5px] border-[#FFFFFF40]
            bg-transparent outline-none focus:ring-0 text-white placeholder-white/70 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !email}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-300 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <GrFormNextLink className="text-white text-2xl" />
            )}
          </button>
        </div>
      </form>

      {message && !isSuccess && (
        <div className="text-center mt-6 px-4 py-2 rounded-lg max-w-md mx-auto bg-red-500/20 border border-red-500/30 text-red-300">
          <p className="text-sm">{message}</p>
        </div>
      )}

      {showModal && (
        <SuccessModal
          message={message}
          close={() => setShowModal(false)}
        />
      )}
    </>
  );
}
