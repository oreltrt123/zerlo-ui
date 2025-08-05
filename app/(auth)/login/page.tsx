import { login } from "../actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue building amazing games.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button formAction={login} className="w-full">
                Log in
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Dont have an account? </span>
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Background section */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8">
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
      </div>
    </div>
  )
}
