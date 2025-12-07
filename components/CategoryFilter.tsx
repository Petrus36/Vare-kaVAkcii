'use client'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const allCategories = ['Všetky', ...categories]

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category === 'Všetky' ? '' : category)}
          className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
            selectedCategory === (category === 'Všetky' ? '' : category)
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-primary-50 shadow-md'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

