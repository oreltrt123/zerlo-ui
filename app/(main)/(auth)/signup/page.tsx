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



// "use client"

// import type React from "react"

// import { createClient } from "@/supabase/client"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useState } from "react"
// import { Video } from "lucide-react"

// export default function SignUpPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [fullName, setFullName] = useState("")
//   const [repeatPassword, setRepeatPassword] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const supabase = createClient()
//     setIsLoading(true)
//     setError(null)

//     if (password !== repeatPassword) {
//       setError("Passwords do not match")
//       setIsLoading(false)
//       return
//     }

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
//           data: {
//             full_name: fullName,
//           },
//         },
//       })
//       if (error) throw error
//       router.push("/sign-up-success")
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "An error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-6">
//       <div className="w-full max-w-sm">
//         <div className="flex flex-col gap-6">
//           <div className="text-center">
//             <div className="flex items-center justify-center mb-4">
//               <Video className="h-8 w-8 text-primary" />
//             </div>
//             <h1 className="text-2xl font-bold">Video Studio</h1>
//             <p className="text-muted-foreground">Professional video recording platform</p>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-2xl">Sign up</CardTitle>
//               <CardDescription>Create a new account</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSignUp}>
//                 <div className="flex flex-col gap-6">
//                   <div className="grid gap-2">
//                     <Label htmlFor="fullName">Full Name</Label>
//                     <Input
//                       id="fullName"
//                       type="text"
//                       placeholder="John Doe"
//                       required
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="m@example.com"
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input
//                       id="password"
//                       type="password"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="repeat-password">Repeat Password</Label>
//                     <Input
//                       id="repeat-password"
//                       type="password"
//                       required
//                       value={repeatPassword}
//                       onChange={(e) => setRepeatPassword(e.target.value)}
//                     />
//                   </div>
//                   {error && <p className="text-sm text-destructive">{error}</p>}
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? "Creating account..." : "Sign up"}
//                   </Button>
//                 </div>
//                 <div className="mt-4 text-center text-sm">
//                   Already have an account?{" "}
//                   <Link href="/login" className="underline underline-offset-4">
//                     Login
//                   </Link>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
