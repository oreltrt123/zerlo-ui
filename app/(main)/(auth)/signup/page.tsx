"use client"
import { useState } from "react"
import { signup } from "../actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignupPage() {
  const [agreed, setAgreed] = useState(false) // state to track agreement
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <section
        className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent w-[100%]"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          background:
            "linear-gradient(90deg, rgba(235, 247, 255, 1) 0%, rgba(214, 239, 255, 1) 35%, rgba(255, 255, 255, 1) 100%)",
        }}
      >
        <form
          action=""
          className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border border-[#8888881A] p-0.5 dark:[--color-muted:var(--color-zinc-900)]"
        >
          <div className="p-8 pb-6">
            <div>
              <h1 className="mb-1 text-xl font-semibold">Create a Zerlo Account</h1>
              <p className="text-sm">Welcome! Create an account to get started</p>
            </div>

            <hr className="my-4 border-dashed" />

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>
                <Input type="email" required name="email" id="email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
                <Input type="password" required name="password" id="password" />
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agree" className="text-sm">
                  I agree to the{" "}
                  <Link href="/legal/privacy" className="text-blue-600 underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/terms" className="text-blue-600 underline">
                    Terms of Use
                  </Link>
                </label>
              </div>

              {/* Continue Button */}
              <Button className="w-full" formAction={signup} disabled={!agreed}>
                Continue
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-(--radius) border p-3 relative top-[-7px]">
            <p className="text-accent-foreground text-center text-sm">
              Have an account?
              <Link
                href="/login"
                style={{
                  color: "#0099FF",
                  fontSize: "13px",
                  marginLeft: "2px",
                  cursor: "default",
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
          <div className="bg-muted rounded-(--radius) border p-3 relative top-[-3px]">
            <p className="text-accent-foreground text-center text-sm">
              Register with your email and password, confirm via the email link, then return to the site and log in.
            </p>
          </div>
                    <div className="bg-muted rounded-(--radius) border p-3">
            <p className="text-accent-foreground text-center text-sm">
              <button
               onClick={() => setIsDemoOpen(true)} 
               style={{
                  color: "#0099FF",
                  fontSize: "13px",
                  marginLeft: "2px",
                  cursor: "default",
                }}>Watch the tutorial</button>
            </p>
          </div>
                {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsDemoOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl h-[65vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/assets/video/SinUp.mp4"
              autoPlay
              muted
              loop
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => setIsDemoOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
        </form>
      </section>
    </div>
  )
}
