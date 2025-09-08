"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Eye, Loader2, Sparkles } from "lucide-react"
import { sketchfabAPI, type SketchfabModel } from "@/lib/sketchfab-api"
import { toast } from "sonner"
import "@/styles/button.css"

interface AssetBrowserProps {
  onAssetSelect: (asset: SketchfabModel) => void
  onClose: () => void
  onModelPreview: (viewerUrl: string) => void
}

export function AssetBrowser({ onAssetSelect, onClose, onModelPreview }: AssetBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<SketchfabModel[]>([])
  const [activeTab, setActiveTab] = useState("characters")
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const loadAssets = async (category: string, query: string = "", append: boolean = false) => {
    setLoading(!append) // Show main loading state only for initial load
    setIsFetchingMore(append) // Show fetching state for pagination
    try {
      let response
      const limit = 48
      if (append && nextUrl) {
        response = await sketchfabAPI.fetchNextPage(nextUrl)
      } else {
        switch (category) {
          case "characters":
            response = await sketchfabAPI.searchModels(query || "character", {
              categories: ["characters-creatures"],
              downloadable: true,
              limit,
            })
            break
          case "weapons":
            response = await sketchfabAPI.searchModels(query || "weapon", {
              categories: ["weapons-military"],
              downloadable: true,
              limit,
            })
            break
          default:
            response = await sketchfabAPI.searchModels("character", {
              categories: ["characters-creatures"],
              downloadable: true,
              limit,
            })
        }
      }
      setAssets((prev) => (append ? [...prev, ...response.results] : response.results))
      setNextUrl(response.next)
    } catch (error) {
      console.error("Error loading assets:", error)
      toast.error("Failed to load 3D assets")
      if (!append) setAssets([])
    } finally {
      setLoading(false)
      setIsFetchingMore(false)
    }
  }

  const handleSearch = () => {
    setAssets([])
    setNextUrl(null)
    loadAssets(activeTab, searchQuery)
  }

  const handleAssetUse = (asset: SketchfabModel) => {
    onAssetSelect(asset)
    toast.success(`Selected ${asset.name} for your game!`)
  }

  useEffect(() => {
    loadAssets("characters", "")
  }, [])

  useEffect(() => {
    if (activeTab) {
      setAssets([])
      setNextUrl(null)
      loadAssets(activeTab, searchQuery)
    }
  }, [activeTab])

  useEffect(() => {
    if (!observerRef.current || !nextUrl || isFetchingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextUrl) {
          loadAssets(activeTab, searchQuery, true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerRef.current)

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [nextUrl, isFetchingMore, activeTab, searchQuery])

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background">
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

          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} size="sm" className="r2552esf25_252trewt3erblueFontDocs">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Fixed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4 mb-4">
            <TabsTrigger value="characters" className="text-xs">
              Characters
            </TabsTrigger>
            <TabsTrigger value="weapons" className="text-xs">
              Weapons
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Asset Grid */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-muted-foreground">Loading 3D assets...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"style={{ overflowY: "scroll", maxHeight: "29%" }}>
            {assets.map((asset) => (
              <Card
                key={asset.uid}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
                onMouseEnter={() => setHoveredAsset(asset.uid)}
                onMouseLeave={() => setHoveredAsset(null)}
              >
                <div className="relative aspect-square">
                  <img
                    src={sketchfabAPI.getModelThumbnail(asset, "medium") || "/placeholder.svg"}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
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
                        onClick={() => onModelPreview(sketchfabAPI.getModelEmbedUrl(asset))}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Downloadable badge */}
                  {asset.isDownloadable && (
                    <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs">Free</Badge>
                  )}
                </div>

                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1 mb-1">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">by {asset.user.displayName}</p>

                  {/* Tags */}
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

        {/* Sentinel element for intersection observer */}
        <div ref={observerRef} className="h-10" />

        {/* Loading more indicator */}
        {isFetchingMore && (
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-muted-foreground">Loading more assets...</span>
          </div>
        )}

        {!loading && assets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p>No assets found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
}

// components/3d/AssetBrowser.tsx
// "use client"
// import { useState, useEffect, useRef, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Search, Download, Eye, Loader2, Sparkles } from "lucide-react"
// import Image from "next/image"
// import { sketchfabAPI, type SketchfabModel } from "@/lib/sketchfab-api"
// import { toast } from "sonner"
// import "@/styles/button.css"

// interface AssetBrowserProps {
//   onAssetSelect: (asset: SketchfabModel) => void
//   onClose: () => void
//   onModelPreview: (viewerUrl: string) => void
// }

// export function AssetBrowser({ onAssetSelect, onClose, onModelPreview }: AssetBrowserProps) {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [assets, setAssets] = useState<SketchfabModel[]>([])
//   const [activeTab, setActiveTab] = useState("characters")
//   const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)
//   const [nextUrl, setNextUrl] = useState<string | null>(null)
//   const [isFetchingMore, setIsFetchingMore] = useState(false)
//   const observerRef = useRef<HTMLDivElement | null>(null)

//   const loadAssets = useCallback(
//     async (category: string, query: string = "", append: boolean = false) => {
//       setLoading(!append)
//       setIsFetchingMore(append)
//       try {
//         let response
//         const limit = 48
//         if (append && nextUrl) {
//           response = await sketchfabAPI.fetchNextPage(nextUrl)
//         } else {
//           switch (category) {
//             case "characters":
//               response = await sketchfabAPI.searchModels(query || "character", {
//                 categories: ["characters-creatures"],
//                 downloadable: true,
//                 limit,
//               })
//               break
//             case "weapons":
//               response = await sketchfabAPI.searchModels(query || "weapon", {
//                 categories: ["weapons-military"],
//                 downloadable: true,
//                 limit,
//               })
//               break
//             default:
//               response = await sketchfabAPI.searchModels("character", {
//                 categories: ["characters-creatures"],
//                 downloadable: true,
//                 limit,
//               })
//           }
//         }
//         setAssets((prev) => (append ? [...prev, ...response.results] : response.results))
//         setNextUrl(response.next)
//       } catch (error) {
//         console.error("Error loading assets:", error)
//         toast.error("Failed to load 3D assets")
//         if (!append) setAssets([])
//       } finally {
//         setLoading(false)
//         setIsFetchingMore(false)
//       }
//     },
//     [nextUrl]
//   )

//   const handleSearch = () => {
//     setAssets([])
//     setNextUrl(null)
//     loadAssets(activeTab, searchQuery)
//   }

//   const handleAssetUse = (asset: SketchfabModel) => {
//     onAssetSelect(asset)
//     toast.success(`Selected ${asset.name} for your game!`)
//   }

//   useEffect(() => {
//     loadAssets("characters", "")
//   }, [loadAssets])

//   useEffect(() => {
//     if (activeTab) {
//       setAssets([])
//       setNextUrl(null)
//       loadAssets(activeTab, searchQuery)
//     }
//   }, [activeTab, loadAssets, searchQuery])

//   useEffect(() => {
//     if (!observerRef.current || !nextUrl || isFetchingMore) return

//     const currentObserver = observerRef.current
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && nextUrl) {
//           loadAssets(activeTab, searchQuery, true)
//         }
//       },
//       { threshold: 0.1 }
//     )

//     observer.observe(currentObserver)

//     return () => {
//       if (currentObserver) observer.unobserve(currentObserver)
//     }
//   }, [nextUrl, isFetchingMore, activeTab, searchQuery, loadAssets])

//   return (
//     <div className="h-full flex flex-col bg-background">
//       <div className="sticky top-0 z-10 bg-background">
//         <div className="p-4 border-b border-border bg-muted/50">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Sparkles className="w-5 h-5 text-blue-500" />
//               <h2 className="text-lg font-semibold">3D Asset Library</h2>
//               <Badge variant="secondary" className="text-xs">
//                 4M+ Models
//               </Badge>
//             </div>
//             <Button variant="ghost" size="sm" onClick={onClose}>
//               ✕
//             </Button>
//           </div>

//           <div className="flex gap-2">
//             <Input
//               placeholder={`Search ${activeTab}...`}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//             />
//             <Button onClick={handleSearch} size="sm" className="r2552esf25_252trewt3erblueFontDocs">
//               <Search className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mx-4 mt-4 mb-4">
//             <TabsTrigger value="characters" className="text-xs">
//               Characters
//             </TabsTrigger>
//             <TabsTrigger value="weapons" className="text-xs">
//               Weapons
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <div className="flex-1 overflow-auto p-4">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//             <span className="ml-2 text-muted-foreground">Loading 3D assets...</span>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" style={{ overflowY: "scroll", maxHeight: "29%" }}>
//             {assets.map((asset) => (
//               <Card
//                 key={asset.uid}
//                 className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
//                 onMouseEnter={() => setHoveredAsset(asset.uid)}
//                 onMouseLeave={() => setHoveredAsset(null)}
//               >
//                 <div className="relative aspect-square">
//                   <Image
//                     src={sketchfabAPI.getModelThumbnail(asset, "medium") || "/placeholder.svg"}
//                     alt={asset.name}
//                     width={300}
//                     height={300}
//                     className="w-full h-full object-cover"
//                   />

//                   {hoveredAsset === asset.uid && (
//                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 animate-in fade-in-0 duration-200">
//                       <Button
//                         size="sm"
//                         onClick={() => handleAssetUse(asset)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white"
//                       >
//                         <Download className="w-4 h-4 mr-1" />
//                         Use in Game
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => onModelPreview(sketchfabAPI.getModelEmbedUrl(asset))}
//                         className="bg-white/90 hover:bg-white"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   )}

//                   {asset.isDownloadable && (
//                     <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs">Free</Badge>
//                   )}
//                 </div>

//                 <CardContent className="p-3">
//                   <h3 className="font-medium text-sm line-clamp-1 mb-1">{asset.name}</h3>
//                   <p className="text-xs text-muted-foreground line-clamp-1 mb-2">by {asset.user.displayName}</p>

//                   <div className="flex flex-wrap gap-1">
//                     {asset.tags?.slice(0, 2).map((tag, index) => (
//                       <Badge key={index} variant="outline" className="text-xs px-1 py-0">
//                         {tag.name}
//                       </Badge>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         <div ref={observerRef} className="h-10" />

//         {isFetchingMore && (
//           <div className="flex items-center justify-center mt-4">
//             <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
//             <span className="ml-2 text-muted-foreground">Loading more assets...</span>
//           </div>
//         )}

//         {!loading && assets.length === 0 && (
//           <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
//             <Search className="w-12 h-12 mb-4 opacity-50" />
//             <p>No assets found</p>
//             <p className="text-sm">Try a different search term</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }