"use client"

import { useState, useEffect, useCallback } from "react"
// import { getClientCredits } from "@/lib/credits"

export function useCredits() {
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/credits")
      if (response.ok) {
        const data = await response.json()
        setCredits(data.credits)
      } else {
        console.error("Failed to fetch credits")
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshCredits = useCallback(() => {
    fetchCredits()
  }, [fetchCredits])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  return {
    credits,
    loading,
    refreshCredits,
  }
}
