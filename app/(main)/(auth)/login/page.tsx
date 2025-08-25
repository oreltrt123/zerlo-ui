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
