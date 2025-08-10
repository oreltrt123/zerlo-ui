"use client";

import React, { useState } from "react";
import "@/styles/terms.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TermsyPage() {
  const [showFontControls, setShowFontControls] = useState(false);
  const [, setFontSize] = useState<number | null>(null);

  const applyFontSize = (size: number) => {
    document.querySelectorAll(".content, .title, h1, h2, p, li").forEach((el) => {
      (el as HTMLElement).style.fontSize = size + "px";
    });
    setFontSize(size);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      applyFontSize(value);
    }
  };

  return (
    <main
      className="min-h-screen py-12 px-6"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background:
          "linear-gradient(90deg, rgba(235, 247, 255, 1) 0%, rgba(214, 239, 255, 1) 35%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      {/* Fixed Font Control Button in Top-Right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 999 }}>
        <Button
          variant={"blueFont"}
          onClick={() => setShowFontControls(!showFontControls)}
        >
          {showFontControls ? "Close Font Controls" : "Font Size"}
        </Button>

        {showFontControls && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "0.8rem",
              boxShadow:
                "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
              marginTop: "0.5rem",
              width: "180px",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Input
              type="number"
              placeholder="Custom px"
              onChange={handleSearchChange}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {[12, 14, 16, 18, 20, 24].map((size) => (
                <Button
                  key={size}
                  variant={"blueFont"}
                  onClick={() => applyFontSize(size)}
                >
                  {size}px
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="terms-container">
        <div className="title">
          <h1 className="text-3xl font-bold text-gray-900">Terms of service</h1>
          <p className="update-date">Last Updated: August 7, 2025</p>
        </div>

        <div className="content">
          <h2>1. What is Our Service?</h2>
          <p>
            Our platform lets you create and manage games using artificial
            intelligence (AI) and advanced tools. Through the site you can:
          </p>
          <ul>
            <li>
              Have our AI automatically create games for you based on your
              instructions.
            </li>
            <li>
              Edit and modify these games directly within the website at any
              time, no extra software needed.
            </li>
            <li>
              After creating a game, easily add a multiplayer game server
              directly on the site.
            </li>
            <li>
              Use another AI that generates code and provides a real-time
              preview of the code, which you can use or modify.
            </li>
            <li>Play games created by other users.</li>
            <li>
              Participate in competitions like “Top 5” and “Game of the Month”.
            </li>
            <li>get a free domain address (e.g., yourgame.zarlo.com).</li>
            <li>And if you want, purchase your own private/custom domain.</li>
          </ul>
        </div>

        <div className="content">
          <h2>2. Who Owns the Games?</h2>
          <p>
            Every game or content you create through the site belongs only to
            you. This means:
          </p>
          <ul>
            <li>You can publish your game anywhere you want.</li>
            <li>
              You can sell, share, or distribute it without any limitations.
            </li>
            <li>
              The site does not claim ownership of your game or its content.
            </li>
            <li>We will not use your game without your permission.</li>
          </ul>
        </div>

        <div className="content">
          <h2>3. Featuring Your Games on the Site</h2>
          <p>
            If we want to feature your game in places like the “Top 5” list or
            homepage, we will ask for your explicit permission first. We will
            not publicly display your game without your clear consent.
          </p>
        </div>

        <div className="content">
          <h2>4. Free and Paid Domains</h2>
          <p>
            If you do not purchase a private domain, your game will have a free
            address that includes our site name, for example: yourgame.zarlo.com.
            If you want a unique domain without our branding, you can buy a
            private domain.
          </p>
        </div>

        <div className="content">
          <h2>5. What is Allowed and Not Allowed in Games?</h2>
          <p>
            You can create games that include action, fighting, or comic-style
            violence. However, it is prohibited to upload games that contain:
          </p>
          <ul>
            <li>
              Hate, racism, discrimination, or harmful speech against
              individuals or groups.
            </li>
            <li>Explicit or offensive sexual content.</li>
            <li>
              Illegal content or material that infringes copyrights. If these
              rules are broken, we may remove your content from the site.
            </li>
          </ul>
        </div>

        <div className="content">
          <h2>6. Responsibility and Content Backup</h2>
          <p>
            The site provides the service “as is” and does not guarantee your
            games will always be available or error-free. It is important that
            you keep backups of your games on your own computer or elsewhere to
            avoid losing them.
          </p>
        </div>

        <div className="content">
          <h2>7. Your Account and Security</h2>
          <p>
            You are responsible for everything that happens with your account.
            Please keep your password secure and do not share your login details
            with anyone.
          </p>
        </div>

        <div className="content">
          <h2>8. Changes to the Terms</h2>
          <p>
            We may update these Terms from time to time. Continuing to use the
            site after updates means you agree to the new Terms.
          </p>
        </div>

        <div className="content">
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions, requests, or problems, feel free to
            contact us anytime at:{" "}
            <a href="mailto:zerlocontactus@gmail.com">
              zerlocontactus@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
