"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Github } from "lucide-react"
import "@/styles/button.css"

interface GitHubSettingsProps {
  chatId: string
}

export default function GitHubSettings({ chatId }: GitHubSettingsProps) {
  const supabase = createClient()
  const [isConnected, setIsConnected] = useState(false)
  const [repoName, setRepoName] = useState("")
  const [loading, setLoading] = useState(false)
  const [repoUrl, setRepoUrl] = useState<string | null>(null)

  const checkConnection = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.provider_token) {
      setIsConnected(true)
    }
  }, [supabase])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const handleConnect = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "repo",  // Required for creating repos
        redirectTo: `${window.location.origin}/auth/callback?next=/chat/${chatId}`,  // Redirect back to this chat after connect
      },
    })
    if (error) {
      toast.error("Failed to connect to GitHub: " + error.message)
    }
  }

  const handleCreateRepo = async () => {
    if (!repoName) {
      toast.error("Enter a repository name")
      return
    }
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.provider_token) {
      toast.error("Not connected to GitHub")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `token ${session.provider_token}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          name: repoName,
          auto_init: true,  // Creates README
          private: false,  // Change to true if needed
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to create repo: " + response.statusText)
      }
      const data = await response.json()
      setRepoUrl(data.html_url)
     toast.success(`Repository created: ${data.html_url}`)
    } catch (error) {
     if (error instanceof Error) {
    toast.error(error.message)
      } else {
    toast.error("An unexpected error occurred")
  }
}

  }

  const handleDisconnect = async () => {
    await supabase.auth.signOut()
    setIsConnected(false)
    setRepoUrl(null)
    toast.success("Disconnected from GitHub")
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">GitHub Integration</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Connect your project to GitHub to create new repositories for your generated components.
      </p>
      {!isConnected ? (
        <Button onClick={handleConnect} className="r2552esf25_252trewt3erblueFontDocs bg-[#0099ffb2] hover:bg-[#0099ffbe] shadow-none">
          <Github className="h-4 w-4" /> Connect to GitHub
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-2 text-green-600">
            <Github className="h-4 w-4" /> Connected to GitHub
          </div>
          <Button variant="destructive" onClick={handleDisconnect}>
            Disconnect
          </Button>
          <div className="space-y-2">
            <Input
              placeholder="Enter repository name (e.g., my-new-project)"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
            />
            <Button onClick={handleCreateRepo} disabled={loading} className="r2552esf25_252trewt3erblueFontDocs bg-[#0099ffb2] hover:bg-[#0099ffbe]">
              {loading ? "Creating..." : "Create New Repository"}
            </Button>
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View Repository: {repoUrl}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  )
}