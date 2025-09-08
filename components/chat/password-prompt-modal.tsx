"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Lock, Shield } from "lucide-react"
import { createClient } from "@/supabase/client"

interface PasswordPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  chatName: string
  chatId: string
}

export function PasswordPromptModal({ isOpen, onClose, onSuccess, chatName, chatId }: PasswordPromptModalProps) {
  const [password, setPassword] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      toast.error("Please enter a password")
      return
    }

    setIsVerifying(true)
    try {
      const { data: securityData, error } = await supabase
        .from("chat_security_beta")
        .select("password_hash")
        .eq("chat_id", chatId)
        .single()

      if (error) {
        throw error
      }

      if (!securityData || !securityData.password_hash) {
        toast.error("No password set for this chat")
        return
      }

      const enteredHash = btoa(password)

      if (enteredHash === securityData.password_hash) {
        toast.success("Access granted")
        onSuccess()
        setPassword("")
      } else {
        toast.error("Incorrect password")
      }
    } catch (error) {
      console.error("Error verifying password:", error)
      toast.error("Failed to verify password")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClose = () => {
    setPassword("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Protected Chat
          </DialogTitle>
          <DialogDescription>
            This chat {chatName} is password protected. Please enter the password to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chat-password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <Input
              id="chat-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter chat password"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isVerifying || !password.trim()}>
              {isVerifying ? "Verifying..." : "Access Chat"}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center">
          Forgot your password? Contact the chat owner for recovery options.
        </div>
      </DialogContent>
    </Dialog>
  )
}