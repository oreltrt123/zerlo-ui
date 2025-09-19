"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/supabase/server" // updated import

export async function login(formData: FormData) {
  const supabase = await createServerClient() // use server client

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/login?error=Could not authenticate user")
  }

  revalidatePath("/", "layout")
  redirect("/chat")
}

export async function signup(formData: FormData) {
  const supabase = await createServerClient() // use server client

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect("/login?error=Could not create user")
  }

  revalidatePath("/", "layout")
  redirect("/chat")
}

export async function logout() {
  const supabase = await createServerClient() // use server client
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
