import { type NextRequest, NextResponse } from "next/server"

interface Video {
  title: string
  description: string
  video_url: string
  duration: string
  order_index: number
  platform: "direct" | "youtube" | "x" | "tiktok" | "other"
  uploadType: "link" | "file"
}

interface RequestBody {
  title: string
  description: string
  videos: Video[]
}

interface EnhancedContent {
  title: string
  description: string
  videos: Video[]
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, videos }: RequestBody = await request.json()

    const prompt = `
    You are an expert course creator. Please enhance the following course content to make it more engaging and professional:
    
    Title: ${title}
    Description: ${description}
    
    Videos: ${videos.map((v, i) => `${i + 1}. ${v.title} - ${v.description}`).join("\n")}
    
    Please provide:
    1. An improved, compelling course title
    2. A detailed, engaging course description that clearly explains what students will learn
    3. Enhanced video titles and descriptions that are more descriptive and engaging
    
    Return the response as JSON with this structure:
    {
      "title": "enhanced title",
      "description": "enhanced description", 
      "videos": [{"title": "enhanced title", "description": "enhanced description", "platform": "direct", "uploadType": "link"}]
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
      throw new Error("Failed to enhance content")
    }

    const data = await response.json()
    const enhancedText = data.candidates[0].content.parts[0].text

    // Try to parse JSON from the response
    try {
      const jsonMatch = enhancedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const enhanced: EnhancedContent = JSON.parse(jsonMatch[0])
        return NextResponse.json(enhanced)
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
    }

    // Fallback: return original content if parsing fails
    return NextResponse.json({ title, description, videos })
  } catch (error) {
    console.error("Error enhancing content:", error)
    return NextResponse.json({ error: "Failed to enhance content" }, { status: 500 })
  }
}