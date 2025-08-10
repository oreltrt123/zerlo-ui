import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/supabase/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const { siteName, componentCode, deploymentId } = await request.json()

    // Validate input
    if (!siteName || !componentCode || !deploymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate site name
    const siteNameRegex = /^[a-zA-Z0-9-]+$/
    if (!siteNameRegex.test(siteName)) {
      return NextResponse.json({ error: "Invalid site name format" }, { status: 400 })
    }

    // Verify user authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify deployment belongs to user
    const { data: deployment, error: deploymentError } = await supabase
      .from("deployed_sites")
      .select("*")
      .eq("id", deploymentId)
      .eq("user_id", user.id)
      .single()

    if (deploymentError || !deployment) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
    }

    // Clean the component code to remove any export statements and make it standalone
    const cleanedComponentCode = componentCode
      .replace(/export\s+default\s+/g, "")
      .replace(/export\s+/g, "")
      .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, "")

    // Create the HTML content for the deployed site
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        }
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect, useMemo, useCallback, useRef } = React;
        
        // Define the component
        function Component() {
            ${cleanedComponentCode}
        }
        
        // Render the component
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(Component));
    </script>
</body>
</html>`

    // Create directory if it doesn't exist
    const deployDir = join(process.cwd(), "public", "deployed")
    await mkdir(deployDir, { recursive: true }).catch(() => {
      // Directory might already exist, that's okay
    })

    // Write the HTML file
    const filePath = join(deployDir, `${siteName}.html`)
    await writeFile(filePath, htmlContent, "utf8")

    // Update deployment status
    await supabase
      .from("deployed_sites")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", deploymentId)

    return NextResponse.json({
      success: true,
      url: `zerlo.online.${siteName}`,
      message: "Site deployed successfully",
    })
  } catch (error) {
    console.error("Deployment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}