"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/supabase/client"
import { useRouter } from "next/navigation"

interface CloneTemplateButtonProps {
  template: {
    id: string
    name: string
    component_code: string
    clone_count: number
  }
}

export function CloneTemplateButton({ template }: CloneTemplateButtonProps) {
  const [isCloning, setIsCloning] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleClone = async () => {
    setIsCloning(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please log in to clone templates")
        router.push("/login")
        return
      }

      // Create a new chat with the cloned template
      const chatName = `Cloned: ${template.name}`

      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .insert([{ name: chatName, user_id: user.id }])
        .select()
        .single()

      if (chatError) throw chatError

      // Add the template as an AI message in the new chat
      const { error: messageError } = await supabase.from("messages").insert([
        {
          chat_id: chat.id,
          sender: "ai",
          content: `I've cloned the template "${template.name}" for you. You can now modify and use this component.`,
          component_code: template.component_code,
        },
      ])

      if (messageError) throw messageError

      // Increment clone count
      await supabase
        .from("templates")
        .update({ clone_count: template.clone_count + 1 })
        .eq("id", template.id)

      toast.success("Template cloned successfully!")
      router.push(`/chat/${chat.id}`)
    } catch (error) {
      console.error("Clone error:", error)
      toast.error("Failed to clone template. Please try again.")
    } finally {
      setIsCloning(false)
    }
  }

  return (
    <Button onClick={handleClone} disabled={isCloning} className="bg-blue-600 hover:bg-blue-700">
      <Copy className="h-4 w-4 mr-2" />
      {isCloning ? "Cloning..." : "Clone Template"}
    </Button>
  )
}
