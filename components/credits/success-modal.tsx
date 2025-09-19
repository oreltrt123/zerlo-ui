"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  creditsAdded: number
}

export function SuccessModal({ isOpen, onClose, creditsAdded }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-xl font-semibold">Payment Successful!</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              <span className="font-semibold text-2xl">{creditsAdded}</span> credits have been added to your account!
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            You can now continue using the AI chat. Each message costs 1 credit.
          </p>

          <Button onClick={onClose} className="w-full">
            Continue Chatting
          </Button>
        </div>
      </div>
    </div>
  )
}
