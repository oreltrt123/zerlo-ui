// Professional Sketchfab API integration for 3D assets
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
  viewerUrl: string
  downloadUrl?: string
  tags: string[]
  categories: Array<{
    name: string
    slug: string
  }>
  user: {
    displayName: string
    profileUrl: string
  }
  animationCount: number
  faceCount: number
  vertexCount: number
  isDownloadable: boolean
}

export interface SketchfabSearchParams {
  q?: string
  categories?: string
  tags?: string
  animated?: boolean
  downloadable?: boolean
  sort_by?: "relevance" | "likes" | "views" | "recent"
  cursor?: string
  count?: number
}

class SketchfabAPI {
  private baseUrl = "https://api.sketchfab.com/v3"
  private apiKey = process.env.SKETCHFAB_API_KEY

  async searchModels(params: SketchfabSearchParams): Promise<{
    results: SketchfabModel[]
    next?: string
    previous?: string
  }> {
    const searchParams = new URLSearchParams()

    if (params.q) searchParams.append("q", params.q)
    if (params.categories) searchParams.append("categories", params.categories)
    if (params.tags) searchParams.append("tags", params.tags)
    if (params.animated) searchParams.append("animated", "true")
    if (params.downloadable) searchParams.append("downloadable", "true")
    if (params.sort_by) searchParams.append("sort_by", params.sort_by)
    if (params.cursor) searchParams.append("cursor", params.cursor)

    searchParams.append("count", (params.count || 24).toString())

    const response = await fetch(`${this.baseUrl}/models?${searchParams}`, {
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Sketchfab API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getModel(uid: string): Promise<SketchfabModel> {
    const response = await fetch(`${this.baseUrl}/models/${uid}`, {
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Sketchfab API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getPopularModels(category?: string): Promise<SketchfabModel[]> {
    const params: SketchfabSearchParams = {
      sort_by: "likes",
      downloadable: true,
      count: 12,
    }

    if (category) {
      params.categories = category
    }

    const result = await this.searchModels(params)
    return result.results
  }

  getEmbedUrl(uid: string): string {
    return `https://sketchfab.com/models/${uid}/embed`
  }
}

export const sketchfabAPI = new SketchfabAPI()

// Popular gaming categories
export const GAMING_CATEGORIES = {
  characters: "characters-creatures",
  weapons: "weapons-military",
  vehicles: "cars-vehicles",
  buildings: "architecture",
  nature: "nature-plants",
  props: "household-objects",
  fantasy: "fantasy-medieval",
  scifi: "science-fiction",
}

// Generate AI-powered search queries based on user input
export function generateAssetSearchQuery(userPrompt: string): SketchfabSearchParams {
  const prompt = userPrompt.toLowerCase()

  // Character-related keywords
  if (
    prompt.includes("character") ||
    prompt.includes("player") ||
    prompt.includes("hero") ||
    prompt.includes("warrior")
  ) {
    return {
      categories: GAMING_CATEGORIES.characters,
      downloadable: true,
      animated: true,
      sort_by: "likes",
    }
  }

  // Weapon keywords
  if (prompt.includes("weapon") || prompt.includes("sword") || prompt.includes("gun") || prompt.includes("bow")) {
    return {
      categories: GAMING_CATEGORIES.weapons,
      downloadable: true,
      sort_by: "likes",
    }
  }

  // Vehicle keywords
  if (prompt.includes("car") || prompt.includes("vehicle") || prompt.includes("ship") || prompt.includes("plane")) {
    return {
      categories: GAMING_CATEGORIES.vehicles,
      downloadable: true,
      sort_by: "likes",
    }
  }

  // Building/Environment keywords
  if (
    prompt.includes("building") ||
    prompt.includes("house") ||
    prompt.includes("castle") ||
    prompt.includes("environment")
  ) {
    return {
      categories: GAMING_CATEGORIES.buildings,
      downloadable: true,
      sort_by: "likes",
    }
  }

  // Default search with user's exact query
  return {
    q: userPrompt,
    downloadable: true,
    sort_by: "relevance",
  }
}
