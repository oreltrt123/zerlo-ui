"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Plus } from "lucide-react"

interface CreditsDisplayProps {
  onUpgradeClick: () => void
}

export function CreditsDisplay({ onUpgradeClick }: CreditsDisplayProps) {
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchCredits = async () => {
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
  }

  useEffect(() => {
    fetchCredits()

    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={credits > 0 ? "default" : "destructive"} className="flex items-center gap-1 px-2 py-1">
        <Coins className="h-3 w-3" />
        <span className="text-xs font-medium">{credits} Credits</span>
      </Badge>

      {credits <= 2 && (
        <Button onClick={onUpgradeClick} size="sm" variant="outline" className="h-6 px-2 text-xs bg-transparent">
          <Plus className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      )}
    </div>
  )
}
