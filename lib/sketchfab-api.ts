// Sketchfab API integration for 3D assets
export interface SketchfabModel {
  uid: string
  name: string
  description: string
  thumbnails: {
    images: Array<{
      url: string
      width: number
      height: number
    }>
  }
  user: {
    displayName: string
    username: string
  }
  tags: Array<{
    name: string
  }>
  categories: Array<{
    name: string
  }>
  viewerUrl: string
  downloadUrl?: string
  isDownloadable: boolean
}

export interface SketchfabSearchResponse {
  results: SketchfabModel[]
  next: string | null
  previous: string | null
  count: number
}

const SKETCHFAB_API_KEY = "b94d7113bcf044788f437847a5a5670c"
const SKETCHFAB_BASE_URL = "https://api.sketchfab.com/v3"

export class SketchfabAPI {
  private apiKey: string

  constructor(apiKey: string = SKETCHFAB_API_KEY) {
    this.apiKey = apiKey
  }

  async searchModels(
    query = "",
    options: {
      categories?: string[]
      tags?: string[]
      downloadable?: boolean
      animated?: boolean
      limit?: number
      offset?: number
    } = {},
  ): Promise<SketchfabSearchResponse> {
    const params = new URLSearchParams()

    if (query) params.append("q", query)
    if (options.categories?.length) {
      params.append("categories", options.categories.join(","))
    }
    if (options.tags?.length) {
      params.append("tags", options.tags.join(","))
    }
    if (options.downloadable) {
      params.append("downloadable", "true")
    }
    if (options.animated !== undefined) {
      params.append("animated", options.animated.toString())
    }

    params.append("count", (options.limit || 24).toString())
    params.append("offset", (options.offset || 0).toString())
    params.append("sort_by", "-likeCount") // Sort by popularity

    const response = await fetch(`${SKETCHFAB_BASE_URL}/models?${params}`, {
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Sketchfab API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async fetchNextPage(nextUrl: string): Promise<SketchfabSearchResponse> {
    if (!nextUrl) {
      throw new Error("No next page URL provided")
    }

    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Sketchfab API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getPopularGameAssets(): Promise<SketchfabSearchResponse> {
    return this.searchModels("", {
      categories: ["characters-creatures", "weapons-military", "vehicles-transport", "architecture"],
      downloadable: true,
      limit: 24,
    })
  }

  async getCharacters(): Promise<SketchfabSearchResponse> {
    return this.searchModels("character", {
      categories: ["characters-creatures"],
      downloadable: true,
      limit: 12,
    })
  }

  async getWeapons(): Promise<SketchfabSearchResponse> {
    return this.searchModels("weapon", {
      categories: ["weapons-military"],
      downloadable: true,
      limit: 12,
    })
  }

  async getVehicles(): Promise<SketchfabSearchResponse> {
    return this.searchModels("vehicle", {
      categories: ["vehicles-transport"],
      downloadable: true,
      limit: 12,
    })
  }

  async getEnvironments(): Promise<SketchfabSearchResponse> {
    return this.searchModels("environment", {
      categories: ["architecture", "nature-plants"],
      downloadable: true,
      limit: 12,
    })
  }

  getModelThumbnail(model: SketchfabModel, size: "small" | "medium" | "large" = "medium"): string {
    const images = model.thumbnails?.images || []
    if (images.length === 0) return "/abstract-3d-model.png"

    // Find appropriate size
    const sizeMap = { small: 200, medium: 400, large: 800 }
    const targetSize = sizeMap[size]

    const bestImage =
      images.filter((img) => img.width >= targetSize).sort((a, b) => a.width - b.width)[0] || images[images.length - 1]

    return bestImage.url
  }

  getModelEmbedUrl(model: SketchfabModel): string {
    return `https://sketchfab.com/models/${model.uid}/embed`
  }
}

export const sketchfabAPI = new SketchfabAPI()