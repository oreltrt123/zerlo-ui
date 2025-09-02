"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import * as React from "react"

// Define the props type to match Next.js expectations for dynamic routes
interface PageProps {
  params: Promise<{ inviteId: string }> // Use Promise for params to match Next.js async props
}

export default function JoinInvitePage({ params }: PageProps) {
  // Resolve the Promise for params
  const resolvedParams = React.use(params)
  const inviteId = resolvedParams.inviteId
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  useEffect(() => {
    const handleInvite = async () => {
      try {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setShowLoginModal(true)
          setIsLoading(false)
          return
        }

        // User is logged in, process the invitation
        const { data: invite, error } = await supabase
          .from("chat_invitations")
          .select("chat_id, status")
          .eq("join_token", inviteId)
          .single()

        if (error || !invite) {
          toast.error("Invalid or expired invitation")
          router.push("/login")
          return
        }

        if (invite.status === "accepted") {
          toast.info("You have already joined this chat")
          router.push(`/chat/${invite.chat_id}`)
          return
        }

        // Update invitation status to accepted
        const { error: updateError } = await supabase
          .from("chat_invitations")
          .update({ status: "accepted", accepted_at: new Date().toISOString() })
          .eq("join_token", inviteId)

        if (updateError) {
          console.error("[v0] Error updating invitation:", updateError)
          toast.error("Error joining chat")
          router.push("/login")
          return
        }

        toast.success("You have successfully joined the chat!")
        router.push(`/chat/${invite.chat_id}`)
      } catch (error) {
        console.error("[v0] Error handling invite:", error)
        toast.error("Error joining chat")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    handleInvite()
  }, [inviteId, router, supabase])

  const handleLogin = async () => {
    setLoginError("")
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setLoginError(error.message)
        setIsLoading(false)
        return
      }

      // After successful login, re-trigger invitation handling
      const { data: invite, error: inviteError } = await supabase
        .from("chat_invitations")
        .select("chat_id, status")
        .eq("join_token", inviteId)
        .single()

      if (inviteError || !invite) {
        toast.error("Invalid or expired invitation")
        router.push("/login")
        return
      }

      if (invite.status === "accepted") {
        toast.info("You have already joined this chat")
        router.push(`/chat/${invite.chat_id}`)
        return
      }

      const { error: updateError } = await supabase
        .from("chat_invitations")
        .update({ status: "accepted", accepted_at: new Date().toISOString() })
        .eq("join_token", inviteId)

      if (updateError) {
        console.error("[v0] Error updating invitation:", updateError)
        toast.error("Error joining chat")
        router.push("/login")
        return
      }

      toast.success("You have successfully joined the chat!")
      router.push(`/chat/${invite.chat_id}`)
    } catch (error) {
      console.error("[v0] Login error:", error)
      setLoginError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      {isLoading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      ) : showLoginModal ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Log in to Join Chat</CardTitle>
            <CardDescription>Please sign in to accept your chat invitation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign In</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                  <Button
                    onClick={handleLogin}
                    disabled={isLoading || !email.trim() || !password.trim()}
                    className="w-full"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      )}
    </div>
  )
}