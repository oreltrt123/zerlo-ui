"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"

interface AnalyticsData {
  page_views: number
  unique_visitors: number
  last_updated: string
}

interface AnalyticsSettingsProps {
  chatId: string
}

export default function AnalyticsSettings({ chatId }: AnalyticsSettingsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const supabase = createClient()

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("analytics")
        .select("page_views, unique_visitors, last_updated")
        .eq("chat_id", chatId)
        .single()
      setAnalytics(data || { page_views: 0, unique_visitors: 0, last_updated: new Date().toISOString() })
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast.error("Error loading analytics data")
    }
  }, [chatId, supabase]) // Include chatId and supabase as dependencies

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics]) // Include fetchAnalytics in the dependency array

  return (
    <div className="bg-white dark:bg-[#1a1d24] p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Analytics</h3>
      {analytics ? (
        <div className="space-y-2 text-sm">
          <p>Page Views: {analytics.page_views}</p>
          <p>Unique Visitors: {analytics.unique_visitors}</p>
          <p>Last Updated: {new Date(analytics.last_updated).toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-[#666666] dark:text-[#8b949e]">No analytics data available.</p>
      )}
    </div>
  )
}