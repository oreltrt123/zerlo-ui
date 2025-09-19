import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/supabase/server" // ✅ updated import

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    const supabase = await createServerClient() // ✅ use server client

    // Get AI-enhanced search suggestions
    const prompt = `
    The user is searching for: "${query}"
    
    Based on this search query, suggest:
    1. 3-5 related search terms that might help them find relevant courses
    2. Course topics that would match their interest
    3. Skill levels they might be interested in
    
    Return as JSON:
    {
      "suggestions": ["suggestion 1", "suggestion 2"],
      "topics": ["topic 1", "topic 2"],
      "skillLevels": ["Beginner", "Intermediate"]
    }
    `

    const aiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GOOGLE_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    let aiSuggestions = null
    if (aiResponse.ok) {
      const aiData = await aiResponse.json()
      const aiText = aiData.candidates[0].content.parts[0].text
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          aiSuggestions = JSON.parse(jsonMatch[0])
        }
      } catch (parseError) {
        console.error("Failed to parse AI suggestions:", parseError)
      }
    }

    // Search courses in database
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,creator_name.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database search error:", error)
    }

    return NextResponse.json({
      courses: courses || [],
      aiSuggestions: aiSuggestions,
      query: query,
    })
  } catch (error) {
    console.error("Error in smart search:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
