"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Copy, Mail, CheckCircle, Clock, Users, UserPlus } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { getSupabase } from "@/lib/supabase"
import { inviteUser, removeUserInvitation, getCurrentUser, getChatMembers } from "@/actions/invite-user"
import "@/styles/button.css"

interface User {
  id: string
  email: string
  status: "pending" | "accepted" | "owner"
  invited_at: string
  join_link?: string
}

interface ChatInvitation {
  id: string
  email: string
  invited_at: string
  join_token: string
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function UsersSettings({ chatId }: { chatId: string }) {
  const [chatMembers, setChatMembers] = useState<User[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [alert, setAlert] = useState<{ title: string; description: string; variant?: "default" | "destructive" } | null>(null)

  const loadData = useCallback(async () => {
    try {
      const supabase = getSupabase()

      // Get current user (owner)
      const userResult = await getCurrentUser()
      if (userResult.success && userResult.user) {
        setCurrentUser(userResult.user)
      }

      // Get chat members
      const membersResult = await getChatMembers(chatId)
      if (membersResult.success) {
        const transformedMembers: User[] = membersResult.members.map((member) => ({
          id: member.id,
          email: member.email,
          status: "accepted",
          invited_at: member.invited_at,
        }))
        setChatMembers(transformedMembers)
      }

      // Get pending invitations
      const { data: invitations, error } = await supabase
        .from("chat_invitations")
        .select("*")
        .eq("chat_id", chatId)
        .eq("status", "pending")
        .order("invited_at", { ascending: false })

      if (error) {
        console.error("[v0] Error loading invitations for chat:", chatId, error)
        setAlert({
          title: "Failed to load invitations",
          description: "Please refresh the page to try again",
          variant: "destructive",
        })
        return
      }

      const transformedInvitations: User[] = (invitations as ChatInvitation[]).map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        status: "pending",
        invited_at: invitation.invited_at,
        join_link: `${window.location.origin}/join/${invitation.join_token}`,
      }))

      setPendingInvitations(transformedInvitations)
    } catch (error) {
      console.error("[v0] Error loading data for chat:", chatId, error)
      setAlert({
        title: "Error",
        description: "Failed to load data. Please try again later.",
        variant: "destructive",
      })
    }
  }, [chatId])

  useEffect(() => {
    loadData()

    const supabase = getSupabase()
    const subscription = supabase
      .channel(`chat_invitations_${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_invitations", filter: `status=eq.pending,chat_id=eq.${chatId}` },
        (payload: { new: ChatInvitation }) => {
          const newInvitation: User = {
            id: payload.new.id,
            email: payload.new.email,
            status: "pending",
            invited_at: payload.new.invited_at,
            join_link: `${window.location.origin}/join/${payload.new.join_token}`,
          }
          setPendingInvitations((prev) => [newInvitation, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [chatId, loadData])

  const handleInvite = async () => {
    setEmailError("")
    setAlert(null)

    if (!inviteEmail.trim()) {
      setEmailError("Email is required")
      return
    }

    if (!isValidEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    const allEmails = [...chatMembers, ...pendingInvitations].map((u) => u.email.toLowerCase())
    const ownerEmail = currentUser?.email?.toLowerCase()

    if (allEmails.includes(inviteEmail.toLowerCase()) || inviteEmail.toLowerCase() === ownerEmail) {
      setEmailError("This user has already been invited or is already a member")
      return
    }

    setIsLoading(true)

    try {
      const result = await inviteUser(inviteEmail, chatId)

      if (result.success && result.invitation) {
        const newInvitation: User = {
          id: result.invitation.id,
          email: result.invitation.email,
          status: "pending",
          invited_at: result.invitation.invited_at,
          join_link: result.invitation.join_link,
        }

        setPendingInvitations((prev) => [newInvitation, ...prev])
        setInviteEmail("")
        setAlert({
          title: "Invitation sent!",
          description: `An invitation email has been sent to ${inviteEmail} for chat ${chatId}`,
        })
      } else {
        setAlert({
          title: "Failed to send invitation",
          description: result.error || "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Invite error for chat:", chatId, error)
      setAlert({
        title: "Failed to send invitation",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveUser = async (userId: string, isInvitation = true) => {
    setAlert(null)
    try {
      const result = await removeUserInvitation(userId)

      if (result.success) {
        if (isInvitation) {
          setPendingInvitations((prev) => prev.filter((invitation) => invitation.id !== userId))
          setAlert({
            title: "Invitation removed",
            description: "The invitation has been cancelled",
          })
        } else {
          setChatMembers((prev) => prev.filter((member) => member.id !== userId))
          setAlert({
            title: "Member removed",
            description: "The member has been removed from the chat",
          })
        }
      } else {
        setAlert({
          title: "Failed to remove",
          description: result.error || "Please try again later",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Remove user error for chat:", chatId, error)
      setAlert({
        title: "Failed to remove",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const handleCopyJoinLink = async (joinLink: string) => {
    setAlert(null)
    try {
      await navigator.clipboard.writeText(joinLink)
      setAlert({
        title: "Link copied!",
        description: "Join link has been copied to clipboard",
      })
    } catch (error) {
      console.error("Copy error:", error)
      setAlert({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "owner":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Owner
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {alert && (
        <Alert variant={alert.variant}>
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Chat Settings for {chatId}
          </CardTitle>
          <CardDescription>Manage users and invitations for chat {chatId}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Users
          </CardTitle>
          <CardDescription>Send email invitations to new users to join this chat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter email address to invite"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value)
                  if (emailError) setEmailError("")
                }}
                disabled={isLoading}
              />
              {emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
            </div>
            <Button onClick={handleInvite} disabled={isLoading || !inviteEmail.trim()} className="r2552esf25_252trewt3erblueFontDocs min-w-[100px]">
              {isLoading ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Chat Members ({(currentUser ? 1 : 0) + chatMembers.length})
          </CardTitle>
          <CardDescription>Users who have access to this chat</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUser && (
                <TableRow>
                  <TableCell className="font-medium">{currentUser.email}</TableCell>
                  <TableCell>{getStatusBadge("owner")}</TableCell>
                  <TableCell className="text-muted-foreground">Owner</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">Cannot remove</span>
                  </TableCell>
                </TableRow>
              )}
              {chatMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.email}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(member.invited_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUser(member.id, false)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            User Invitations ({pendingInvitations.length})
          </CardTitle>
          <CardDescription>Pending email invitations that haven&apos;t been accepted yet</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending invitations</p>
              <p className="text-sm">Send an invitation above to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invitation.invited_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {invitation.join_link && (
                          <Button variant="outline" size="sm" onClick={() => handleCopyJoinLink(invitation.join_link!)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveUser(invitation.id, true)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}