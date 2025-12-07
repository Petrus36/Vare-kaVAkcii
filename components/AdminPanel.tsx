'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  recipe: string
  ingredients: string
  cookingTime: string
  difficulty: string
  servings: string
  category: string
  tiktokUrl: string
}

interface AdminPanelProps {
  onLogout: () => void
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    recipe: '',
    ingredients: '',
    cookingTime: '',
    difficulty: '',
    servings: '',
    category: '',
    tiktokUrl: '',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingRecipe ? `/api/recipes/${editingRecipe.id}` : '/api/recipes'
      const method = editingRecipe ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchRecipes()
        resetForm()
        setShowAddForm(false)
        setEditingRecipe(null)
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      alert('Chyba pri ukladaní receptu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Naozaj chcete vymazať tento recept?')) {
      return
    }

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRecipes()
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Chyba pri mazaní receptu')
    }
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setFormData({
      name: recipe.name,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      recipe: recipe.recipe,
      ingredients: recipe.ingredients || '',
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl,
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      recipe: '',
      ingredients: '',
      cookingTime: '',
      difficulty: '',
      servings: '',
      category: '',
      tiktokUrl: '',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Načítavam...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Späť na stránku
            </button>
            <button
              onClick={onLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Odhlásiť sa
            </button>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              resetForm()
              setEditingRecipe(null)
              setShowAddForm(!showAddForm)
            }}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg"
          >
            {showAddForm ? 'Zrušiť' : '+ Pridať nový recept'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingRecipe ? 'Upraviť recept' : 'Nový recept'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Názov jedla *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popis
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL obrázka *
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategória
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Napr. Hlavné jedlá, Dezerty..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Čas prípravy
                  </label>
                  <input
                    type="text"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Napr. 30 min, 1 hod..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Obtiažnosť
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Vyberte obtiažnosť</option>
                    <option value="Ľahká">Ľahká</option>
                    <option value="Stredná">Stredná</option>
                    <option value="Náročná">Náročná</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Počet porcií
                  </label>
                  <input
                    type="text"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Napr. 4 porcie, 6-8 porcií..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingrediencie *
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Jedna ingrediencia na riadok:&#10;500g múky&#10;2 vajcia&#10;1 lyžica soli..."
                />
                <p className="text-xs text-gray-500 mt-1">Jedna ingrediencia na riadok</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postup prípravy *
                </label>
                <textarea
                  value={formData.recipe}
                  onChange={(e) => setFormData({ ...formData, recipe: e.target.value })}
                  required
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Zadajte postup prípravy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok URL
                </label>
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://www.tiktok.com/@user/video/..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  {editingRecipe ? 'Uložiť zmeny' : 'Pridať recept'}
                </button>
                {editingRecipe && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm()
                      setEditingRecipe(null)
                      setShowAddForm(false)
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Zrušiť
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center"><span class="text-4xl">🍳</span></div>'
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                    <span className="text-4xl">🍳</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(recipe)}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
                  >
                    Upraviť
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    Vymazať
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recipes.length === 0 && !showAddForm && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">Zatiaľ žiadne recepty</p>
            <p className="text-gray-400 mt-2">Pridajte prvý recept pomocou tlačidla vyššie</p>
          </div>
        )}
      </div>
    </div>
  )
}

