type Props = {
  isSearching: boolean
  totalResults: number
  searchQuery: string
  selectedCategory: string | null
}

export default function ResultsSummary({ isSearching, totalResults, searchQuery, selectedCategory }: Props) {
  return (
    <div className="text-center">
      <p className="text-gray-600">
        {isSearching ? (
          "Searching..."
        ) : (
          <>
            Found {totalResults} result{totalResults !== 1 ? "s" : ""}
            {searchQuery && (
              <>
                {" "}
                for <span className="font-medium">{searchQuery}</span>
              </>
            )}
            {selectedCategory && (
              <>
                {" "}
                in 
              </>
            )}
          </>
        )}
      </p>
    </div>
  )
}