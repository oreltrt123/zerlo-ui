"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"

export default function LandingPage() {
  const [chatName, setChatName] = useState("")
  const router = useRouter()

  const handleCreateChat = () => {
    if (chatName.trim()) {
      // Generate a simple unique ID (e.g., timestamp + random string)
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      router.push(`/chat/${id}?name=${encodeURIComponent(chatName)}`)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-[#0d1117] p-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-lg border border-[#e6e6e6] bg-white p-8 shadow-lg dark:border-[#30363d] dark:bg-[#161b22]">
        <Sparkles className="h-12 w-12 text-[#0969da] dark:text-[#58a6ff]" />
        <h1 className="text-2xl font-bold text-[#0f1419] dark:text-[#f0f6fc]">Create a New Chat</h1>
        <p className="text-center text-[#666666] dark:text-[#8b949e]">
          Enter a name for your new chat session to get started.
        </p>
        <Input
          type="text"
          placeholder="e.g., My Data Visualization Chat"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          className="w-full border-[#e6e6e6] bg-[#fafafa] text-[#0f1419] focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#f0f6fc] dark:focus:border-[#58a6ff] dark:focus:ring-[#58a6ff]"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleCreateChat()
            }
          }}
        />
        <Button
          onClick={handleCreateChat}
          disabled={!chatName.trim()}
          className="w-full h-12 bg-[#0969da] text-white font-[500] rounded-[8px] border-0 hover:bg-[#0860ca] dark:bg-[#58a6ff] dark:hover:bg-[#4493f8] disabled:bg-[#e6e6e6] dark:disabled:bg-[#30363d] disabled:text-[#8c9196] dark:disabled:text-[#6e7681]"
        >
          Start Chat
        </Button>
      </div>
    </main>
  )
} 
//     onError: (err) => {
//       console.error("Data generation error:", err)
//       toast.error("Error generating data.", { description: err.message })
//     },
//   })

//   const handleGenerate = () => {
//     if (!data) {
//       toast.warning("Please paste some data first.")
//       return
//     }
//     console.log("handleGenerate called with data:", data)
//     setGeneratedComponent("")
//     complete(data)
//   }

//   const handleGenerateData = () => {
//     const prompt = "Generate sample data for data visualization"
//     generateData(prompt)
//   }

//   const handleCopyCode = () => {
//     if (generatedComponent) {
//       navigator.clipboard.writeText(generatedComponent)
//       toast.success("Code copied to clipboard!")
//     }
//   }

//   return (
//     <main className="min-h-screen bg-[#fafafa] dark:bg-[#0d1117]">
//       <Toaster richColors position="top-center" />

//       {/* Main Content - Two Columns */}
//       <div className="flex flex-col lg:flex-row h-[100vh]">
//         {/* Left Column: Input and Options */}
//         <div className="w-full lg:w-1/2 bg-white dark:bg-[#161b22] border-r border-[#e6e6e6] dark:border-[#30363d] overflow-y-auto">
//           <div className="p-6 border-b border-[#e6e6e6] dark:border-[#30363d]">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center justify-center w-8 h-8 bg-[#f6f6f6] dark:bg-[#21262d] rounded-lg">
//                   <Database className="h-4 w-4 text-[#666666] dark:text-[#8b949e]" />
//                 </div>
//                 <div>
//                   <h2 className="text-[#0f1419] dark:text-[#f0f6fc] font-[600] text-base">Input Data</h2>
//                   <p className="text-[#666666] dark:text-[#8b949e] text-sm font-[450]">
//                     Paste any structured data: CSV, JSON, tables, or lists
//                   </p>
//                 </div>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleGenerateData}
//                 disabled={isGeneratingData}
//                 className="h-8 px-3 text-xs font-[500] border-[#e6e6e6] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#0f1419] dark:text-[#f0f6fc] bg-transparent"
//               >
//                 {isGeneratingData ? (
//                   <div className="flex items-center gap-1.5">
//                     <div className="w-3 h-3 border border-[#666666] dark:border-[#8b949e] border-t-transparent rounded-full animate-spin" />
//                     <span>Generating...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-1.5">
//                     <Wand2 className="w-3 h-3" />
//                     <span>Generate Data</span>
//                   </div>
//                 )}
//               </Button>
//             </div>
//           </div>

//           <div className="p-6">
//             <Textarea
//               className="min-h-[240px] font-mono text-sm border-[#e6e6e6] dark:border-[#30363d] focus:border-[#0969da] dark:focus:border-[#58a6ff] focus:ring-1 focus:ring-[#0969da] dark:focus:ring-[#58a6ff] resize-none bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc]"
//               placeholder="Quarter,Revenue,Deals,Pipeline\nQ1,125000,45,280000\nQ2,145000,52,320000\n...\n\nOr try one of the examples below"
//               value={data}
//               onChange={(e) => setData(e.target.value)}
//             />

//             <div className="mt-6 space-y-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-[500] text-[#666666] dark:text-[#8b949e]">Quick examples:</span>
//                 <Badge
//                   variant="outline"
//                   className="text-xs font-[450] bg-[#f6f6f6] dark:bg-[#21262d] text-[#666666] dark:text-[#8b949e] border-[#e6e6e6] dark:border-[#30363d]"
//                 >
//                   Click to try
//                 </Badge>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-8 px-3 text-xs font-[500] border-[#e6e6e6] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#0f1419] dark:text-[#f0f6fc] bg-transparent"
//                   onClick={() => setData(exampleData.fitness)}
//                 >
//                   🏃 Fitness Tracking
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-8 px-3 text-xs font-[500] border-[#e6e6e6] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#0f1419] dark:text-[#f0f6fc] bg-transparent"
//                   onClick={() => setData(exampleData.library)}
//                 >
//                   📚 Library Collection
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-8 px-3 text-xs font-[500] border-[#e6e6e6] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#0f1419] dark:text-[#f0f6fc] bg-transparent"
//                   onClick={() => setData(exampleData.orders)}
//                 >
//                   🍕 Restaurant Orders
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-8 px-3 text-xs font-[500] border-[#e6e6e6] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#0f1419] dark:text-[#f0f6fc] bg-transparent"
//                   onClick={() => setData(exampleData.weather)}
//                 >
//                   🌡️ Weather Monitoring
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-8 px-3 text-xs font-[500] border-[#e6e6e6] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#0f1419] dark:text-[#f0f6fc] bg-transparent"
//                   onClick={() => setData(exampleData.employees)}
//                 >
//                   💼 Employee Directory
//                 </Button>
//               </div>
//             </div>

//             <Button
//               onClick={handleGenerate}
//               disabled={isLoading || !data.trim()}
//               className="w-full mt-8 h-12 bg-[#0969da] dark:bg-[#58a6ff] hover:bg-[#0860ca] dark:hover:bg-[#4493f8] text-white font-[500] rounded-[8px] border-0 disabled:bg-[#e6e6e6] dark:disabled:bg-[#30363d] disabled:text-[#8c9196] dark:disabled:text-[#6e7681]"
//             >
//               {isLoading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>Generating component...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <Sparkles className="w-4 h-4" />
//                   <span>Generate UI Component</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </div>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Right Column: Generated Component Preview/Code */}
//         <div className="w-full lg:w-1/2 bg-white dark:bg-[#161b22] overflow-y-auto">
//           {generatedComponent && (
//             <div className="border border-[#e6e6e6] dark:border-[#30363d] rounded-[12px] m-4">
//               <div className="p-4 border-b border-[#e6e6e6] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-[#22c55e] dark:bg-[#3fb950] rounded-full" />
//                   <span className="text-sm font-[500] text-[#0f1419] dark:text-[#f0f6fc]">Generated Component</span>
//                 </div>
//                 <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "preview" | "code")}>
//                   <TabsList className="grid w-full grid-cols-2 h-8">
//                     <TabsTrigger value="preview" className="text-xs font-[450]">
//                       Preview
//                     </TabsTrigger>
//                     <TabsTrigger value="code" className="text-xs font-[450]">
//                       Code
//                     </TabsTrigger>
//                   </TabsList>
//                 </Tabs>
//               </div>

//               <Tabs value={viewMode}>
//                 <TabsContent value="preview">
//                   <DynamicComponent componentCode={generatedComponent} />
//                 </TabsContent>
//                 <TabsContent value="code">
//                   <div className="relative p-4">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="absolute top-2 right-2 text-[#666666] dark:text-[#8b949e] hover:bg-[#e6e6e6] dark:hover:bg-[#30363d]"
//                       onClick={handleCopyCode}
//                       aria-label="Copy code"
//                     >
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                     <pre className="overflow-auto p-4 text-sm bg-[#fafafa] dark:bg-[#0d1117] text-[#0f1419] dark:text-[#f0f6fc] rounded-md">
//                       <code>{generatedComponent}</code>
//                     </pre>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }