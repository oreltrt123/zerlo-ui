import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, type } = await request.json()

    const prompt = `
    Analyze the following ${type} content and provide improvement suggestions:
    
    Content: "${content}"
    
    Please provide:
    1. A quality score (1-10)
    2. Specific improvement suggestions
    3. SEO recommendations
    4. Engagement tips
    5. Clarity improvements
    
    Return as JSON:
    {
      "qualityScore": 8,
      "improvements": ["suggestion 1", "suggestion 2"],
      "seoTips": ["tip 1", "tip 2"],
      "engagementTips": ["tip 1", "tip 2"],
      "clarityImprovements": ["improvement 1", "improvement 2"]
    }
    `

    const response = await fetch(
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

    if (!response.ok) {
      throw new Error("Failed to analyze content")
    }

    const data = await response.json()
    const analysisText = data.candidates[0].content.parts[0].text

    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])
        return NextResponse.json(analysis)
      }
    } catch (parseError) {
      console.error("Failed to parse AI analysis:", parseError)
    }

    return NextResponse.json({ error: "Failed to parse analysis" }, { status: 500 })
  } catch (error) {
    console.error("Error analyzing content:", error)
    return NextResponse.json({ error: "Content analysis failed" }, { status: 500 })
  }
}
