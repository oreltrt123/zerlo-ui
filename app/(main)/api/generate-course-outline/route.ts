import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, targetAudience } = await request.json()

    const prompt = `
    Create a comprehensive course outline for a "${topic}" course.
    
    Course Details:
    - Difficulty Level: ${difficulty}
    - Target Audience: ${targetAudience}
    
    Please generate:
    1. A compelling course title
    2. A detailed course description (2-3 paragraphs)
    3. 5-8 video lessons with titles and descriptions
    4. Estimated duration for each video
    5. Learning objectives
    
    Return the response as JSON with this structure:
    {
      "title": "course title",
      "description": "detailed description",
      "learningObjectives": ["objective 1", "objective 2"],
      "videos": [
        {
          "title": "video title",
          "description": "video description", 
          "estimatedDuration": "5:30"
        }
      ]
    }
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
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
      throw new Error("Failed to generate course outline")
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const outline = JSON.parse(jsonMatch[0])
        return NextResponse.json(outline)
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
    }

    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
  } catch (error) {
    console.error("Error generating course outline:", error)
    return NextResponse.json({ error: "Failed to generate course outline" }, { status: 500 })
  }
}