import { Button } from "@/components/ui/button"

type Props = {
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
}

const categories = [
  { id: "games", name: "Games", icon: "🎮" },
  { id: "apps", name: "Apps", icon: "📱" },
  { id: "components", name: "Components", icon: "🧩" },
  { id: "templates", name: "Templates", icon: "📄" },
  { id: "tools", name: "Tools", icon: "🔧" },
  { id: "other", name: "Other", icon: "✨" },
]

export default function Categories({ selectedCategory, setSelectedCategory }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedCategory(null)}
        className={`r2552esf25_252trewt3erblueFontDocsCommunity hover:text-black hover:bg-[#8888881A] hover:border-[#88888800] shadow-none border border-[#8888881A] ${
          selectedCategory === null ? "bg-black hover:text-white hover:bg-black text-white" : ""
        }`}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(category.id)}
          className={`r2552esf25_252trewt3erblueFontDocsCommunity hover:text-black hover:bg-[#8888881A] hover:border-[#88888800] shadow-none border border-[#8888881A] ${
            selectedCategory === category.id ? "bg-black hover:text-white hover:bg-black text-white" : ""
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </Button>
      ))}
    </div>
  )
}