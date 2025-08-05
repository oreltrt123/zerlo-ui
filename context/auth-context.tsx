"use client"

import { createContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Define the shape of the user object
interface User {
  id: string
  email: string
  token: string
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for stored token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Assume token is stored in localStorage
        const token = localStorage.getItem("authToken")
        if (token) {
          // Verify token with backend
          const response = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.ok) {
            const data = await response.json()
            setUser({ id: data.id, email: data.email, token })
          } else {
            localStorage.removeItem("authToken")
            setUser(null)
          }
        }
      } catch (err) {
        console.error("Error verifying token:", err)
        localStorage.removeItem("authToken")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const data = await response.json()
        setUser({ id: data.id, email: data.email, token: data.token })
        localStorage.setItem("authToken", data.token)
        toast.success("Logged in successfully!")
        router.push(`/chat/${Date.now()}-${Math.random().toString(36).substring(2, 9)}?name=New%20Chat`)
      } else {
        const error = await response.json()
        toast.error("Login failed.", { description: error.message })
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error("Error during login.")
    }
  }

  // Register function
  const register = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const data = await response.json()
        setUser({ id: data.id, email: data.email, token: data.token })
        localStorage.setItem("authToken", data.token)
        toast.success("Registered successfully!")
      } else {
        const error = await response.json()
        toast.error("Registration failed.", { description: error.message })
      }
    } catch (err) {
      console.error("Registration error:", err)
      toast.error("Error during registration.")
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("authToken")
    toast.success("Logged out successfully!")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}