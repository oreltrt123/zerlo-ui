import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Video Studio</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up for Video Studio. Please check your email to confirm your account
                before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
