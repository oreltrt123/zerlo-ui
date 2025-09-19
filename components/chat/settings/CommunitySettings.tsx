"use client"
import CommunityPostForm from "@/components/community/CommunityPostForm"

interface CommunitySettingsProps {
  chatId: string
}

export default function CommunitySettings({ chatId }: CommunitySettingsProps) {
  return <CommunityPostForm chatId={chatId} />
}
