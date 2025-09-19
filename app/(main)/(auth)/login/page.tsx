import { login } from "../actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen" 
        style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background: "linear-gradient(90deg, rgba(235, 247, 255, 1) 0%, rgba(214, 239, 255, 1) 35%, rgba(255, 255, 255, 1) 100%)",
      }}>
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
          <section className="flex min-h-screen px-4 py-16 w-[100%] md:py-32 dark:bg-transparent">
            <form
                action=""
                className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border border-[#8888881A] p-0.5 dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <h1 className="mb-1 text-xl font-semibold">Sign In to Zerlo</h1>
                        <p className="text-sm">Welcome back! Sign in to continue</p>
                    </div>

                    <hr className="my-4 border-dashed" />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                            />
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="pwd"
                                    className="text-sm">
                                    Password
                                </Label>
                                <Button
                                    asChild
                                    variant="link"
                                    size="sm">
                                    {/* <Link
                                        href="#"
                                        className="link intent-info variant-ghost text-sm">
                                        Forgot your Password ?
                                    </Link> */}
                                </Button>
                            </div>
                            <Input
                                type="password"
                                required
                                id="password"
                                name="password"
                            />
                        </div>

                        <Button className="w-full" formAction={login}>Sign In</Button>
                    </div>
                </div>

                <div className="bg-muted rounded-(--radius) border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Dont have an account ?
                            <Link href="/signup" style={{color: "#0099FF", fontSize: "13px", marginLeft: "2px", cursor: "default"}}>Create account</Link>
                    </p>
                </div>
            </form>
        </section>
      </div>

      {/* Right side - Background section */}
      {/* <div className="hidden lg:flex flex-1 items-center justify-center p-8">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-12 max-w-lg text-white shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Build Epic Games</h2>
              <p className="text-blue-100 text-lg">
                Join thousands of developers creating the next generation of gaming experiences with our powerful game
                development platform.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">Visual scripting tools</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">Cross-platform deployment</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-blue-100">Real-time collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
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

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const supabase = createClient()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//         options: {
//           emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
//         },
//       })
//       if (error) throw error
//       router.push("/")
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
//               <CardTitle className="text-2xl">Login</CardTitle>
//               <CardDescription>Enter your email below to login to your account</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleLogin}>
//                 <div className="flex flex-col gap-6">
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
//                   {error && <p className="text-sm text-destructive">{error}</p>}
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? "Logging in..." : "Login"}
//                   </Button>
//                 </div>
//                 <div className="mt-4 text-center text-sm">
//                   Don&apos;t have an account?{" "}
//                   <Link href="/signup" className="underline underline-offset-4">
//                     Sign up
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

