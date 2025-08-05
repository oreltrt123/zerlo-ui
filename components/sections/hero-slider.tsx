"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function HeroSlider() {
  const [inputValue, setInputValue] = useState("");

  const suggestions = [
    "Reporting Dashboard",
    "Gaming Platform",
    "Onboarding Portal",
    "Networking App",
  ];

  return (
    <div className="max-w-[1380px] mx-auto p-4 lg:p-8">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg overflow-hidden">
        {/* Image & Input Section */}
        <div className="w-full md:w-1/2 lg:w-3/4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut"}}
            className="bg-white rounded-xl p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Share your game idea — start creating, playing, and publishing!"
                  className="w-full p-3 border rounded-md text-black placeholder-gray-400 focus:outline-none h-[120px] resize-none"
                />
                <Link href="/chat">
                  <button
                    className="absolute right-[17px] p-2 bg-[rgb(0,153,255)] text-white rounded-full hover:bg-[rgba(0,153,255,0.83)] transition-colors"
                    style={{ marginTop: "20px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10">
          <h2 className="text-4xl font-medium text-gray-900 mb-4">
            AI Chat Builds a Game
          </h2>
          <p className="text-gray-600 mb-6">
            Describe your game idea in chat, and watch AI turn it into a playable experience. Design, code, and test — all in one place.
          </p>
          <Link href="/chat" className="text-[rgb(0,153,255)] hover:underline font-medium">
            Start building your game &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
