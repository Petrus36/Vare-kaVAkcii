import Link from 'next/link'
import Image from 'next/image'

interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  category?: string
  cookingTime?: string
  difficulty?: string
}

interface FoodCardProps {
  recipe: Recipe
}

export default function FoodCard({ recipe }: FoodCardProps) {
  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
        <div className="relative h-64 w-full overflow-hidden">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
              <span className="text-6xl">🍳</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6">
          {recipe.category && (
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-3">
              {recipe.category}
            </span>
          )}
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
            {recipe.name}
          </h3>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {recipe.description}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {recipe.cookingTime && (
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span>
                  {recipe.cookingTime}
                </span>
              )}
              {recipe.difficulty && (
                <span className="flex items-center">
                  <span className="mr-1">⭐</span>
                  {recipe.difficulty}
                </span>
              )}
            </div>
            <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Zobraziť</span>
              <span className="ml-2">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

