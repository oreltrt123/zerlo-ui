// components/GeneratedPreview.tsx
"use client"
import type React from "react"
import { useMemo } from "react"
import MultiFileSandbox from "@/components/MultiFileSandbox"

interface GeneratedPreviewProps {
  code: string
  editMode: boolean
  setGeneratedComponent: (code: string) => void
}

interface ProjectFile {
  name: string
  content: string
}

export function parseGeneratedCode(code: string): ProjectFile[] {
  // Enhanced parser for multi-file AI-generated code using --- filename --- separators
  // Ignores explanations before the first separator and extracts only code between separators
  const fileSeparatorRegex = /---\s*([^\s].*?(\\|\/)?([^\s\\\/]+\.(tsx?|ts|js(x)?|css|json|md|png|jpg|jpeg|svg|gif|ico)))\s*---/gi
  const sections: string[] = []
  let lastIndex = 0
  let match

  // Split the code into sections: explanations, filename1, code1, filename2, code2, ...
  while ((match = fileSeparatorRegex.exec(code)) !== null) {
    // Add the content between previous match and current (code for previous file)
    if (lastIndex < match.index) {
      sections.push(code.slice(lastIndex, match.index).trim())
    }
    // Add the filename
    sections.push(match[1].trim())
    lastIndex = fileSeparatorRegex.lastIndex
  }

  // Add remaining content after last separator
  if (lastIndex < code.length) {
    sections.push(code.slice(lastIndex).trim())
  }

  // Now pair filenames and contents: start from index 1 (first filename), pair with next section as content
  const files: ProjectFile[] = []
  for (let i = 1; i < sections.length; i += 2) {
    const fileName = sections[i]
    const contentSection = sections[i + 1] || ""

    if (fileName) {
      // Clean up content: remove markdown fences, extra newlines, trim
      const cleanedContent = contentSection
        .replace(/^```[a-zA-Z0-9_-]*\n?/gm, "")  // Remove opening code blocks
        .replace(/\n?```$/gm, "")              // Remove closing code blocks
        .replace(/\n\s*\n/g, "\n")             // Normalize newlines
        .trim()

      // Only add if content is not empty and looks like code (not just explanations)
      if (cleanedContent.length > 0 && !/^\s*(Okay|Based|Here's|Let's|I'll|You are|Current|CORE|OUTPUT|ALWAYS)\s*/i.test(cleanedContent)) {
        files.push({
          name: fileName,
          content: cleanedContent,
        })
      }
    }
  }

  // If no valid files extracted (e.g., no separators or only explanations), fallback to comprehensive multi-file Next.js template
  // Inject the cleaned input code into the main page.tsx to avoid empty/single-file output
  if (files.length === 0) {
    const cleanedInput = code
      .replace(/^```[a-zA-Z0-9_-]*\n?/gm, "")
      .replace(/\n?```$/gm, "")
      .replace(/\n\s*\n/g, "\n")
      .trim()

    // Filter out pure explanations from cleanedInput
    const codeOnlyInput = cleanedInput.split(/---\s*[^\s].*?---/gi).pop()?.trim() || cleanedInput
    const finalCodeInput = codeOnlyInput.replace(/\s*(Okay|Based|Here's|Let's|I'll|You are|Current|CORE|OUTPUT|ALWAYS)\s*:?.*\n?/gi, "").trim()

    const defaultProject: ProjectFile[] = [
      {
        name: "app/layout.tsx",
        content: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Generated Professional Website",
  description: "A modern Next.js TypeScript website with game-like UI elements, advanced features, and responsive design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <main className="container mx-auto px-4 py-8 min-h-screen">{children}</main>
      </body>
    </html>
  );
}`,
      },
      {
        name: "app/page.tsx",
        content: `${finalCodeInput || `import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}`}`,
      },
      {
        name: "app/globals.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    ) rgb(var(--background-start-rgb));
}`,
      },
      {
        name: "components/Nav.tsx",
        content: `import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui

export default function Nav() {
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">TaskFlow</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:gap-10">
          <Link href="#features" className="text-sm hover:opacity-70">Features</Link>
          <Link href="#cta" className="text-sm hover:opacity-70">Pricing</Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Link href="/contact">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}`,
      },
      {
        name: "components/Hero.tsx",
        content: `import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:py-12 lg:py-12">
      <div className="container flex flex-col justify-center space-y-4 text-center">
        <div className="mx-auto max-w-2xl sm:text-left">
          <h1 className="text-3xl font-black tracking-tighter sm:text-5xl xl:text-6xl/none">
            TaskFlow: Organize your tasks, simplify your life.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:max-w-2xl">
            TaskFlow helps you stay on top of everything with smart alerts, flexible task management, and seamless collaboration.
          </p>
          <div className="mt-6 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button size="lg" className="px-8">Get Started Free</Button>
            <Button variant="outline" size="lg" className="px-8">Learn More</Button>
          </div>
        </div>
        {/* Add hero image */}
        <div className="mx-auto w-full max-w-full sm:max-w-4xl">
          <img src="/hero-taskflow.png" alt="TaskFlow Hero" className="mx-auto block rounded-lg" />
        </div>
      </div>
    </section>
  );
}`,
      },
      {
        name: "components/Features.tsx",
        content: `export default function Features() {
  const features = [
    {
      title: "Smart Alerts",
      description: "Never miss a deadline with intelligent notifications tailored to your workflow.",
      icon: "/icons/alert.png",
    },
    {
      title: "Flexible Management",
      description: "Customize your boards, lists, and cards to fit your unique project needs.",
      icon: "/icons/flexible.png",
    },
    {
      title: "Seamless Collaboration",
      description: "Work together in real-time with your team, no matter where they are.",
      icon: "/icons/collaborate.png",
    },
  ];

  return (
    <section id="features" className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="space-y-2 rounded-lg border p-4">
            <img src={feature.icon} alt="" className="h-8 w-8" />
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      },
      {
        name: "components/CTA.tsx",
        content: `import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section id="cta" className="container space-y-6 bg-muted pb-8 pt-6 md:py-12 lg:py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to get started?
        </h2>
        <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          Join thousands of teams using TaskFlow to streamline their workflow and achieve more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg">Start Free Trial</Button>
          <Button variant="outline" size="lg">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}`,
      },
      {
        name: "components/Footer.tsx",
        content: `export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between space-y-4 py-10 lg:flex-row lg:py-12">
        <div className="flex flex-col items-center gap-4 px-8 sm:h-12 md:flex-row lg:px-0">
          <span className="text-base font-medium">TaskFlow</span>
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; 2025 TaskFlow. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
          <span className="px-2 text-muted-foreground">·</span>
          <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
        </div>
      </div>
    </footer>
  );
}`,
      },
      {
        name: "next.config.js",
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}

module.exports = nextConfig`,
      },
      {
        name: "tailwind.config.js",
        content: `import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config`,
      },
      {
        name: "package.json",
        content: `{
  "name": "taskflow-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "~5.5.3"
  }
}`,
      },
      // Public assets placeholders - AI can replace with base64
      {
        name: "public/hero-taskflow.png",
        content: "// Placeholder for hero image. Use base64: data:image/png;base64,... or upload actual file",
      },
      {
        name: "public/icons/alert.png",
        content: "// Placeholder for icon. Use base64: data:image/png;base64,...",
      },
      {
        name: "public/icons/flexible.png",
        content: "// Placeholder for icon. Use base64: data:image/png;base64,...",
      },
      {
        name: "public/icons/collaborate.png",
        content: "// Placeholder for icon. Use base64: data:image/png;base64,...",
      },
      {
        name: "public/favicon.ico",
        content: "// Placeholder favicon",
      },
    ]

    return defaultProject
  }

  // If files extracted but fewer than 5, supplement with additional components/pages to ensure richness
  if (files.length < 5) {
    const supplementFiles = [
      {
        name: "app/about/page.tsx",
        content: `export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About TaskFlow</h1>
      <p>Learn more about our mission to simplify task management.</p>
    </div>
  );
}`,
      },
      {
        name: "app/contact/page.tsx",
        content: `import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <form className="space-y-4 max-w-md">
        <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <textarea placeholder="Message" className="w-full p-2 border rounded" rows={4}></textarea>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
}`,
      },
      {
        name: "components/ui/button.tsx",
        content: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,
      },
      {
        name: "lib/utils.ts",
        content: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
      },
    ]

    // Add supplements without duplicating existing files
    supplementFiles.forEach((sup) => {
      if (!files.some(f => f.name === sup.name)) {
        files.push(sup)
      }
    })
  }

  return files
}

function stripMarkdownFences(raw: string): string {
  let s = raw?.trim() || ""
  s = s.replace(/^```[a-zA-Z0-9_-]*\n?/m, "").replace(/\n?```$/m, "")
  return s
}

const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({ code, editMode, setGeneratedComponent }) => {
  const processedCode = useMemo(() => stripMarkdownFences(code), [code])
  const projectFiles = useMemo(() => parseGeneratedCode(processedCode), [processedCode])

  return (
    <MultiFileSandbox
      files={projectFiles}
      editMode={editMode}
      setGeneratedComponent={setGeneratedComponent}
      showPreview={true}
      height={800}
    />
  )
}

export default GeneratedPreview

// "use client"
// import type React from "react"
// import { useMemo } from "react"
// import MultiFileSandbox from "@/components/MultiFileSandbox"

// interface GeneratedPreviewProps {
//   code: string
//   editMode: boolean
//   setGeneratedComponent: (code: string) => void
// }

// interface GameFile {
//   name: string
//   content: string
//   type: "html" | "css" | "js" | "ts"
// }

// export function parseGeneratedCode(code: string): GameFile[] {
//   // If it's a single HTML file, extract separate files
//   if (code.includes("<!DOCTYPE html>")) {
//     const files: GameFile[] = []

//     // Extract HTML structure
//     const htmlMatch = code.match(/<html[\s\S]*?<\/html>/i)
//     if (htmlMatch) {
//       let htmlContent = htmlMatch[0]

//       // Extract and separate CSS
//       const styleMatches = htmlContent.match(/<style[\s\S]*?<\/style>/gi)
//       if (styleMatches) {
//         let combinedCSS = ""
//         styleMatches.forEach((styleBlock, index) => {
//           const cssContent = styleBlock.replace(/<\/?style[^>]*>/gi, "")
//           combinedCSS += cssContent + "\n\n"
//           // Remove from HTML
//           htmlContent = htmlContent.replace(styleBlock, index === 0 ? '<link rel="stylesheet" href="styles.css">' : "")
//         })
//         if (combinedCSS.trim()) {
//           files.push({
//             name: "styles.css",
//             content: combinedCSS.trim(),
//             type: "css",
//           })
//         }
//       }

//       // Extract and separate JavaScript
//       const scriptMatches = htmlContent.match(/<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/gi)
//       if (scriptMatches) {
//         let combinedJS = ""
//         scriptMatches.forEach((scriptBlock, index) => {
//           const jsContent = scriptBlock.replace(/<\/?script[^>]*>/gi, "")
//           combinedJS += jsContent + "\n\n"
//           // Remove from HTML
//           htmlContent = htmlContent.replace(scriptBlock, index === 0 ? '<script src="game.js"></script>' : "")
//         })
//         if (combinedJS.trim()) {
//           files.push({
//             name: "game.js",
//             content: combinedJS.trim(),
//             type: "js",
//           })
//         }
//       }

//       // Clean up HTML
//       htmlContent = htmlContent.replace(/\n\s*\n/g, "\n")
//       files.unshift({
//         name: "index.html",
//         content: htmlContent,
//         type: "html",
//       })
//     }

//     return files.length > 0
//       ? files
//       : [
//           {
//             name: "index.html",
//             content: code,
//             type: "html",
//           },
//         ]
//   }

//   // Default single file
//   return [
//     {
//       name: "index.html",
//       content: code,
//       type: "html",
//     },
//   ]
// }

// function stripMarkdownFences(raw: string) {
//   let s = raw?.trim() || ""
//   s = s.replace(/^```[a-zA-Z0-9_-]*\n?/m, "").replace(/\n?```$/m, "")
//   return s
// }

// const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({ code, editMode, setGeneratedComponent }) => {
//   const processedCode = useMemo(() => stripMarkdownFences(code), [code])
//   const gameFiles = useMemo(() => parseGeneratedCode(processedCode), [processedCode])

//   return <MultiFileSandbox files={gameFiles} editMode={editMode} setGeneratedComponent={setGeneratedComponent} />
// }

// export default GeneratedPreview
