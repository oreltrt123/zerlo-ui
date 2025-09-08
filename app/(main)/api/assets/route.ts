import { type NextRequest, NextResponse } from "next/server"
import { sketchfabAPI, generateAssetSearchQuery, GAMING_CATEGORIES } from "@/lib/3d-apis/sketchfab"

export async function POST(request: NextRequest) {
  try {
    const { category, query } = await request.json()

    let searchParams

    if (query) {
      // Use AI-powered search query generation
      searchParams = generateAssetSearchQuery(query)
    } else {
      // Use category-based search
      const categoryMapping: Record<string, string> = {
        characters: GAMING_CATEGORIES.characters,
        weapons: GAMING_CATEGORIES.weapons,
        vehicles: GAMING_CATEGORIES.vehicles,
        buildings: GAMING_CATEGORIES.buildings,
        nature: GAMING_CATEGORIES.nature,
        fantasy: GAMING_CATEGORIES.fantasy,
        scifi: GAMING_CATEGORIES.scifi,
      }

      searchParams = {
        categories: categoryMapping[category] || GAMING_CATEGORIES.characters,
        downloadable: true,
        sort_by: "likes" as const,
        count: 24,
      }
    }

    const results = await sketchfabAPI.searchModels(searchParams)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Assets API error:", error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "characters"

    const results = await sketchfabAPI.getPopularModels(GAMING_CATEGORIES[category as keyof typeof GAMING_CATEGORIES])

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Assets API error:", error)
    return NextResponse.json({ error: "Failed to fetch popular assets" }, { status: 500 })
  }
}
