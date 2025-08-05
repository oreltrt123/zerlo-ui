import React from "react";

export const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  // { label: "Terms of Use", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[rgba(0,0,0,0.05)] py-8 px-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top message */}
        <div className="flex flex-col gap-1 text-left">
          <p className="text-[40px] font-semibold text-[#2B2B2B] leading-snug">
            Zerlo — the smartest way to <span className="text-[rgb(0,153,255)]">build</span><br />
            your next <span className="text-[rgb(0,153,255)]">winning game</span>
          </p>
        </div>

        <div className="bg-[#8888881A] h-px w-full" />

        {/* Bottom row with left + right */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Left side text */}
          <div className="text-sm text-gray-700 font-medium">
            <p>© 2025 Zerlo Inc. All rights reserved.</p>
          </div>

          {/* Right side: two rows of links */}
          <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm text-gray-700 font-medium">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="cursor-pointer hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
