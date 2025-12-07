import { getRecipeById } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default async function RecipePage({ params }: PageProps) {
  const recipe = await getRecipeById(params.id)

  if (!recipe) {
    notFound()
  }

  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split('\n').filter((line) => line.trim() !== '')
    : []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/" 
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors font-medium"
      >
        <span className="mr-2">←</span>
        Späť na recepty
      </Link>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px] w-full">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
              <span className="text-8xl">🍳</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              {recipe.name}
            </h1>
            {recipe.category && (
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                {recipe.category}
              </span>
            )}
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Description */}
          {recipe.description && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Recipe Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {recipe.cookingTime && (
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-sm text-gray-600 mb-1">Čas prípravy</div>
                <div className="text-lg font-bold text-gray-800">{recipe.cookingTime}</div>
              </div>
            )}
            {recipe.difficulty && (
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-sm text-gray-600 mb-1">Obtiažnosť</div>
                <div className="text-lg font-bold text-gray-800">{recipe.difficulty}</div>
              </div>
            )}
            {recipe.servings && (
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🍽️</div>
                <div className="text-sm text-gray-600 mb-1">Porcie</div>
                <div className="text-lg font-bold text-gray-800">{recipe.servings}</div>
              </div>
            )}
            {recipe.tiktokUrl && (
              <div className="bg-black rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📱</div>
                <div className="text-sm text-white mb-1">Video</div>
                <a
                  href={recipe.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-white hover:underline"
                >
                  TikTok
                </a>
              </div>
            )}
          </div>

          {/* TikTok Button */}
          {recipe.tiktokUrl && (
            <div className="mb-8">
              <a
                href={recipe.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                <span className="mr-3 text-2xl">📱</span>
                Pozrieť video návod na TikTok
                <span className="ml-3">→</span>
              </a>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            {ingredientsList.length > 0 && (
              <div className="bg-gradient-to-br from-primary-50 to-amber-50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">🥘</span>
                  Ingrediencie
                </h2>
                <ul className="space-y-3">
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-3 mt-1">✓</span>
                      <span className="text-gray-700 leading-relaxed">{ingredient.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions */}
            {recipe.recipe && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">📝</span>
                  Postup prípravy
                </h2>
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 rounded-2xl p-8">
                    {recipe.recipe}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Width Instructions if no ingredients */}
          {ingredientsList.length === 0 && recipe.recipe && (
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center border-b-2 border-primary-200 pb-3">
                <span className="mr-3">📝</span>
                Postup prípravy
              </h2>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 rounded-2xl p-8">
                  {recipe.recipe}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
