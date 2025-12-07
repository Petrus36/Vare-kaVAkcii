'use client'

import { useState, useEffect, useMemo } from 'react'
import FoodCard from '@/components/FoodCard'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'

interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  category: string
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes')
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    const cats = recipes
      .map((r) => r.category)
      .filter((cat) => cat && cat.trim() !== '')
    return Array.from(new Set(cats))
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        !selectedCategory || recipe.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [recipes, searchQuery, selectedCategory])

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🍳</div>
          <div className="absolute bottom-20 right-20 text-8xl opacity-20 animate-pulse">👨‍🍳</div>
          <div className="absolute top-1/2 left-1/4 text-5xl opacity-20 animate-pulse delay-300">🥘</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Vareška v Akcii
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Objavte najlepšie recepty pre každý deň. Jednoduché, chutné a otestované.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="mr-2">⏱️</span>
              Rýchle recepty
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="mr-2">👨‍👩‍👧‍👦</span>
              Pre celú rodinu
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="mr-2">✨</span>
              Jednoduché prípravy
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Načítavam recepty...</p>
          </div>
        ) : (
          <>
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            
            {categories.length > 0 && (
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}

            {filteredRecipes.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg mb-2">
                  {searchQuery || selectedCategory
                    ? 'Nenašli sa žiadne recepty'
                    : 'Zatiaľ žiadne recepty'}
                </p>
                <p className="text-gray-400">
                  {searchQuery || selectedCategory
                    ? 'Skúste zmeniť vyhľadávanie alebo kategóriu'
                    : 'Prihláste sa do admin panelu a pridajte prvý recept!'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <p className="text-gray-600">
                    Našlo sa <span className="font-bold text-primary-600">{filteredRecipes.length}</span>{' '}
                    {filteredRecipes.length === 1 ? 'recept' : 'receptov'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredRecipes.map((recipe) => (
                    <FoodCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
