"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette, Check } from "lucide-react"

interface StyleSelectorProps {
  selectedStyle: string
  onStyleChange: (style: string) => void
}

const buttonStyles = [
  {
    id: "gaming",
    name: "Gaming Style",
    description: "Futuristic gaming button with gradient and animations",
  },
  {
    id: "playstore",
    name: "App Store Style",
    description: "Clean app store button with modern design",
  },
  {
    id: "3d-play",
    name: "3D Play Button",
    description: "3D button with hover animations and depth",
  },
]

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const [open, setOpen] = useState(false)

  const getSelectedStyleName = () => {
    const style = buttonStyles.find((s) => s.id === selectedStyle)
    return style ? style.name : "Style"
  }

  const renderPreviewButton = (styleId: string) => {
    switch (styleId) {
      case "gaming":
        return (
          <button className="gaming-button w-full">
            <span>PLAY GAME</span>
          </button>
        )
      case "playstore":
        return (
          <a className="playstore-button w-full justify-center" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="icon" viewBox="0 0 512 512">
              <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
            </svg>
            <span className="texts">
              <span className="text-1">GET IT ON</span>
              <span className="text-2">Game Store</span>
            </span>
          </a>
        )
      case "3d-play":
        return (
          <button className="button-with-icon w-full">
            <svg className="icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                className="color000000 svgShape"
                fill="#ffffff"
                d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"
              ></path>
            </svg>
            <span className="text">Play</span>
          </button>
        )
      default:
        return <Button className="w-full">Default Button</Button>
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-3 hover:bg-[#88888811] text-muted-foreground hover:text-muted-foreground rounded-lg border-0 font-medium text-xs"
          aria-label="Select button style"
          title="Choose button design for your games"
        >
          <Palette className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">{getSelectedStyleName()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-80" align="start">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Choose Button Style</h4>
          <div className="space-y-3">
            {buttonStyles.map((style) => (
              <div key={style.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{style.name}</p>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onStyleChange(style.id)
                      setOpen(false)
                    }}
                    className={`h-6 w-6 p-0 ${selectedStyle === style.id ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <Check className="h-4 w-4" />{selectedStyle === style.id && <Check className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{renderPreviewButton(style.id)}</div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
