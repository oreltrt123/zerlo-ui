"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Gamepad2, Check } from "lucide-react"

interface GameTypeSelectorProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

const gameTypes = [
  {
    id: "2d",
    name: "2D Games",
    description: "Classic 2D games with sprites and pixel art",
    examples: "Platformers, Puzzle Games, Side-scrollers",
  },
  {
    id: "3d",
    name: "3D Games",
    description: "Modern 3D games with realistic graphics",
    examples: "FPS, Racing, Adventure Games",
  },
  {
    id: "vr",
    name: "VR Games",
    description: "Virtual Reality immersive experiences",
    examples: "VR Adventures, Simulations",
  },
]

export function GameTypeSelector({ selectedType, onTypeChange }: GameTypeSelectorProps) {
  const [open, setOpen] = useState(false)

  const getSelectedTypeName = () => {
    const type = gameTypes.find((t) => t.id === selectedType)
    return type ? type.name : "Type"
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-3 hover:bg-[#88888811] text-muted-foreground hover:text-muted-foreground rounded-lg border-0 font-medium text-xs"
          aria-label="Select game type"
          title="Choose game dimension and type"
        >
          <Gamepad2 className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">{getSelectedTypeName()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-80" align="start">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Choose Game Type</h4>
          <div className="space-y-3">
            {gameTypes.map((type) => (
              <div
                key={type.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedType === type.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
                onClick={() => {
                  onTypeChange(type.id)
                  setOpen(false)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm">{type.name}</h5>
                  {selectedType === type.id && <Check className="h-4 w-4 text-blue-600" />}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{type.description}</p>
                <p className="text-xs text-gray-500">{type.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
