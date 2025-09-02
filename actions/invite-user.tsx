"use server"

import { Resend } from "resend"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.error("[v0] Get current user error:", error || "No user found")
      return { success: false, user: null }
    }

    return { success: true, user }
  } catch (error) {
    console.error("[v0] Get current user error:", error)
    return { success: false, user: null }
  }
}

export async function getChatMembers(chatId = "default") {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const { data: members, error } = await supabase
      .from("chat_invitations")
      .select("*")
      .eq("chat_id", chatId)
      .eq("status", "accepted")
      .order("invited_at", { ascending: false })

    if (error) {
      console.error("[v0] Get chat members error:", error)
      return { success: false, members: [] }
    }

    return { success: true, members: members || [] }
  } catch (error) {
    console.error("[v0] Get chat members error:", error)
    return { success: false, members: [] }
  }
}

export async function inviteUser(email: string, chatId = "default") {
  try {
    // Create Supabase server client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Generate unique join token
    const joinToken = crypto.randomUUID()
    const joinLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/join/${joinToken}`

    // Insert invitation into database
    const { data: invitation, error: dbError } = await supabase
      .from("chat_invitations")
      .insert({
        email,
        chat_id: chatId,
        join_token: joinToken,
        status: "pending",
        invited_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return { success: false, error: `Failed to create invitation: ${dbError.message}` }
    }

    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] Email error: RESEND_API_KEY is missing")
      // Temporary workaround: Keep invitation in database for debugging
      return {
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          status: invitation.status,
          invited_at: invitation.invited_at,
          join_link: joinLink,
        },
        warning: "Email not sent: RESEND_API_KEY is missing. Invitation saved for debugging.",
      }
    }

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Chat Invitations <onboarding@resend.dev>",
      to: [email],
      subject: "You've been invited to join a chat!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">You've been invited to join a chat!</h2>
          <p style="font-size: 16px; line-height: 1.5;">You have been invited to join an exclusive chat. Click the button below to accept your invitation and get started:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${joinLink}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              Accept Invitation
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff; margin: 15px 0;">
            <code style="word-break: break-all; font-size: 14px;">${joinLink}</code>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error("[v0] Email error details:", emailError.name, emailError.message, emailError)
      // Temporary workaround: Keep invitation in database for debugging
      return {
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          status: invitation.status,
          invited_at: invitation.invited_at,
          join_link: joinLink,
        },
        warning: `Email not sent: ${emailError.message}. Invitation saved for debugging.`,
      }
    }

    console.log("[v0] Invitation sent successfully:", emailData)
    return {
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        status: invitation.status,
        invited_at: invitation.invited_at,
        join_link: joinLink,
      },
    }
  } catch (error) {
    console.error("[v0] Invite user error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function removeUserInvitation(invitationId: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const { error } = await supabase.from("chat_invitations").delete().eq("id", invitationId)

    if (error) {
      console.error("[v0] Remove invitation error:", error)
      return { success: false, error: `Failed to remove invitation: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Remove invitation error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}