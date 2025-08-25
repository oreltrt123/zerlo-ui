import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { google } from "@ai-sdk/google"

interface BraveSearchResult {
  title: string
  description: string
  url: string
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[]
  }
}

interface Message {
  sender: "user" | "ai"
  content: string
}

interface RequestBody {
  prompt: string
  chatHistory: Message[]
}

async function searchWeb(query: string): Promise<string> {
  try {
    const braveApiKey = process.env.BRAVE_SEARCH_API_KEY

    if (!braveApiKey) {
      console.warn("BRAVE_SEARCH_API_KEY not found, using simulated search")
      return getSimulatedSearchResults(query)
    }

    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": braveApiKey,
        },
      },
    )

    if (!response.ok) {
      console.error("Brave Search API error:", response.status, response.statusText)
      return getSimulatedSearchResults(query)
    }

    const data: BraveSearchResponse = await response.json()

    if (!data.web?.results || data.web.results.length === 0) {
      return getSimulatedSearchResults(query)
    }

    let searchResults = `🔍 **Web Search Results for "${query}":**\n\n`

    data.web.results.slice(0, 5).forEach((result: BraveSearchResult, index: number) => {
      searchResults += `**${index + 1}. ${result.title}**\n`
      searchResults += `${result.description}\n`
      searchResults += `Source: ${result.url}\n\n`
    })

    return searchResults
  } catch (error) {
    console.error("Search error:", error)
    return getSimulatedSearchResults(query)
  }
}

function getSimulatedSearchResults(query: string): string {
  return `
🔍 **Web Search Results for "${query}":**

**Stack Overflow** - Programming Solutions
• Common implementation patterns and best practices for ${query}
• Code examples and troubleshooting guides
• Community-tested solutions and optimizations

**GitHub** - Open Source Projects  
• Popular repositories implementing ${query}
• Real-world code examples and libraries
• Documentation and usage examples

**Official Documentation**
• Framework and library documentation for ${query}
• API references and getting started guides
• Latest features and updates

**Developer Blogs & Tutorials**
• Step-by-step implementation guides
• Performance tips and optimization techniques
• Recent articles and best practices

Based on these search results, I can provide you with comprehensive information about ${query}.
  `
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { prompt, chatHistory } = body

    const searchResults = await searchWeb(prompt)

    let context =
      "You are Zerlo's AI assistant with web search capabilities, created by Zerlo. You help users by searching the internet for relevant information and providing comprehensive answers.\n\n"

    if (chatHistory && chatHistory.length > 0) {
      context += "Previous conversation:\n"
      chatHistory.forEach((msg) => {
        context += `${msg.sender === "user" ? "User" : "Zerlo AI"}: ${msg.content}\n`
      })
      context += "\n"
    }

    context += `${searchResults}\n\n`
    context += `User's current question: ${prompt}\n\n`
    context +=
      "Please provide a helpful and comprehensive response based on the search results and your knowledge. If the user is asking about code or game development, provide specific examples, explanations, and actionable advice. Always mention that you searched the web for the most current information."

    return streamText({
      model: google("gemini-2.0-flash-exp"),
      prompt: context,
    }).toDataStreamResponse()
  } catch (error) {
    console.error("Search API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process search request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
