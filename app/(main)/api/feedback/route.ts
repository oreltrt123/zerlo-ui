import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { type, page, comment } = await request.json()

    // Here you would typically send an email using a service like Resend, SendGrid, etc.
    // For now, we'll just log the feedback
    console.log("Feedback received:", {
      type,
      page,
      comment,
      timestamp: new Date().toISOString(),
    })

    // In a real implementation, you would send an email to orelrevivo4000@gmail.com
    // Example with a hypothetical email service:
    /*
    await emailService.send({
      to: 'orelrevivo4000@gmail.com',
      subject: `Documentation Feedback: ${type}`,
      html: `
        <h2>New Documentation Feedback</h2>
        <p><strong>Page:</strong> ${page}</p>
        <p><strong>Feedback:</strong> ${type}</p>
        ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ''}
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
    })
    */

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing feedback:", error)
    return NextResponse.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
