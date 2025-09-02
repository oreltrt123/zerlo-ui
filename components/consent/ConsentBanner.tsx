// components/consent/ConsentBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { hasConsented, setConsent } from "./consentUtils";
import { cn } from "@/lib/utils"
import "@/styles/button.css"

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsented()) {
      setVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    setConsent();
    setVisible(false);

    // Optional: send consent to server
    await fetch("/api/consent", { method: "POST" });
  };

  if (!visible) return null;

  return (
    <div
        className={cn(
          "bg-popover text-popover-foreground z-50 fixed bottom-4 left-4 w-80 rounded-md p-4 outline-hidden",
        )}
        style={{
          boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
        }}
        >
      <p className="text-gray-700 text-sm">
        We use cookies and need your approval for our{" "}
        <a href="legal/privacy" className="text-[#0099FF]">Privacy Policy</a> and{" "}
        <a href="legal/terms" className="text-[#0099FF]">Terms of Use</a>.
      </p>
      <button
        onClick={handleAccept}
        className="mt-2 bg-[#0099ff38] hover:bg-[#0099ff2a] text-[#505050be] rounded px-4 py-2 transition r2552esf25_252trewt3erblueFontDocs"
      >
        I Agree
      </button>
    </div>
  );
}
