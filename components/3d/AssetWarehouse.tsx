// components/3d/AssetWarehouse.tsx
"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Eye, Loader2, Sparkles, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"
import { sketchfabAPI, type SketchfabModel } from "@/lib/sketchfab-api"
import { toast } from "sonner"

interface AssetBrowserProps {
  onAssetSelect: (asset: SketchfabModel) => void
  onClose: () => void
}

export function AssetBrowser({ onAssetSelect, onClose }: AssetBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<SketchfabModel[]>([])
  const [activeTab, setActiveTab] = useState("characters")
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadAssets = useCallback(
    async (category: string, query: string = "", offset: number = 0) => {
      setLoading(true)
      try {
        let response
        const limit = 12
        switch (category) {
          case "characters":
            response = await sketchfabAPI.searchModels(query || "character", {
              categories: ["characters-creatures"],
              downloadable: true,
              limit,
              offset: offset * limit,
            })
            break
          case "weapons":
            response = await sketchfabAPI.searchModels(query || "weapon", {
              categories: ["weapons-military"],
              downloadable: true,
              limit,
              offset: offset * limit,
            })
            break
          default:
            response = await sketchfabAPI.getCharacters()
        }
        setAssets(response.results)
        setHasMore(!!response.next)
      } catch (error) {
        console.error("Error loading assets:", error)
        toast.error("Failed to load 3D assets")
        setAssets([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setPage(0)
      loadAssets(activeTab, searchQuery, 0)
    } else {
      loadAssets(activeTab, "", 0)
    }
  }

  const handleAssetUse = (asset: SketchfabModel) => {
    onAssetSelect(asset)
    toast.success(`Selected ${asset.name} for your game!`)
  }

  const handlePageChange = (direction: "up" | "down") => {
    const newPage = direction === "up" ? page + 1 : page - 1
    if (newPage >= 0) {
      setPage(newPage)
      loadAssets(activeTab, searchQuery, newPage)
    }
  }

  useEffect(() => {
    loadAssets("characters", "", 0)
  }, [loadAssets])

  useEffect(() => {
    if (activeTab) {
      setPage(0)
      loadAssets(activeTab, searchQuery, 0)
    }
  }, [activeTab, searchQuery, loadAssets])

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">3D Asset Library</h2>
            <Badge variant="secondary" className="text-xs">
              4M+ Models
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="characters" className="text-xs">
            Characters
          </TabsTrigger>
          <TabsTrigger value="weapons" className="text-xs">
            Weapons
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-muted-foreground">Loading 3D assets...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <Card
                  key={asset.uid}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
                  onMouseEnter={() => setHoveredAsset(asset.uid)}
                  onMouseLeave={() => setHoveredAsset(null)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={sketchfabAPI.getModelThumbnail(asset, "medium") || "/placeholder.svg"}
                      alt={asset.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />

                    {hoveredAsset === asset.uid && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 animate-in fade-in-0 duration-200">
                        <Button
                          size="sm"
                          onClick={() => handleAssetUse(asset)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Use in Game
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(asset.viewerUrl, "_blank")}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {asset.isDownloadable && (
                      <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs">Free</Badge>
                    )}
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1 mb-1">{asset.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">by {asset.user.displayName}</p>

                    <div className="flex flex-wrap gap-1">
                      {asset.tags?.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && assets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p>No assets found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("down")}
              disabled={page === 0}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("up")}
              disabled={!hasMore}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  )
}