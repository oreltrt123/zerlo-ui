"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface UserData {
  id: string
  email: string
  invited_at: string
  join_link?: string
}

interface UsersSettingsProps {
  chatId: string
}

export default function UsersSettings({ chatId }: UsersSettingsProps) {
  const [users, setUsers] = useState<UserData[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [lastInviteTime, setLastInviteTime] = useState<string | null>(null)
  const supabase = createClient()

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("invites")
        .select("id, email, invited_at")
        .eq("chat_id", chatId)
      if (data) {
        const usersWithLinks = data.map((user) => ({
          ...user,
          join_link: `https://yourapp.com/join/${user.id}`,
        }))
        setUsers(usersWithLinks)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Error loading users")
    }
  }, [chatId, supabase])

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.warning("Please enter an email address")
      return
    }
    try {
      await supabase.from("invites").insert({
        chat_id: chatId,
        email: inviteEmail,
        invited_at: new Date().toISOString(),
      })
      setLastInviteTime(new Date().toLocaleString())
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail("")
      fetchUsers()
    } catch (error) {
      console.error("Error inviting user:", error)
      toast.error("Error sending invitation")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a1d24] p-4 rounded-lg shadow-sm">
        <Label className="text-lg font-semibold">Invite User</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email to invite"
            className="border-[#e6e6e6] dark:border-[#30363d]"
          />
          <Button onClick={handleInviteUser}>Invite</Button>
        </div>
        {lastInviteTime && (
          <p className="text-sm text-[#666666] dark:text-[#8b949e] mt-2">
            Last invited at: {lastInviteTime}
          </p>
        )}
      </div>
      <div className="bg-white dark:bg-[#1a1d24] p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Invited Users</h3>
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Invited At</TableHead>
                <TableHead>Join Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.invited_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <a
                      href={user.join_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {user.join_link}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-[#666666] dark:text-[#8b949e]">No users invited yet.</p>
        )}
      </div>
    </div>
  )
}