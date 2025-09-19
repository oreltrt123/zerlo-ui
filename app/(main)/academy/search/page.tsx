import AcademySidebar from "@/components/academy/academy-sidebar"
import SmartSearch from "@/components/academy/smart-search"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <AcademySidebar />

      <div className="ml-64 min-h-screen">
        
        <div className="max-w-6xl mx-auto px-8 py-12">
               <div className="text-center mb-12">
      </div>
          <div className="mb-8">
            <h1 className="text-3xl text-accent-foreground font-bold mb-2">Smart Course Search</h1>
            <p className="text-accent-foreground">Find courses with AI-powered search and recommendations</p>
          </div>

          <SmartSearch />
        </div>
      </div>
    </div>
  )
}
