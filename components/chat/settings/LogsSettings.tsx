"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/supabase/client"
import { toast } from "sonner"

interface LogData {
  id: string
  timestamp: string
  user_id: string
  action: string
}

interface LogsSettingsProps {
  chatId: string
}

export default function LogsSettings({ chatId }: LogsSettingsProps) {
  const [logs, setLogs] = useState<LogData[]>([])
  const supabase = createClient()

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("logs")
        .select("id, timestamp, user_id, action")
        .eq("chat_id", chatId)
        .order("timestamp", { ascending: false })
      setLogs(data || [])
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast.error("Error loading logs")
    }
  }, [chatId, supabase])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="bg-white dark:bg-[#1a1d24] p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Logs</h3>
      {logs.length > 0 ? (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log.id} className="text-sm border-b border-[#e6e6e6] dark:border-[#30363d] py-2">
              {new Date(log.timestamp).toLocaleString()} - User {log.user_id}: {log.action}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[#666666] dark:text-[#8b949e]">No logs available.</p>
      )}
    </div>
  )
}