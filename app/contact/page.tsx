// components/ContactForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("Error sending message.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 py-20 px-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl border border-[#8888881A] rounded-xl bg-white overflow-hidden">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 p-10 bg-[#8888881A]">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-6">
            We&apos;d love to hear from you! Fill out the form and we&apos;ll reply as
            soon as possible.
          </p>
          <p className="text-gray-500">
            Email us directly at{" "}
            <span className="text-[rgb(0,153,255)] font-semibold">
              zerlocontactus@gmail.com
            </span>
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-10 bg-white">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number (Optional)
              </label>
              <Input
                type="tel"
                name="phone"
                placeholder="+972 58 000 0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                type="text"
                name="subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                name="message"
                rows={5}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" variant="blue" className="w-full">
              Send Message
            </Button>

            {status && (
              <p className="text-sm text-center text-gray-600">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}