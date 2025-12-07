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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Prosím vyberte obrázok')
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Obrázok musí byť menší ako 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.details || 'Upload failed'
        console.error('Upload error:', errorMessage)
        alert(`Chyba pri nahrávaní obrázka: ${errorMessage}`)
        return null
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      const errorMessage = error instanceof Error ? error.message : 'Neznáma chyba'
      alert(`Chyba pri nahrávaní obrázka: ${errorMessage}`)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = formData.imageUrl

      // Upload new image if file is selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile)
        if (!uploadedUrl) {
          alert('Chyba pri nahrávaní obrázka')
          setUploading(false)
          return
        }
        imageUrl = uploadedUrl
      }

      // If editing and no new file, keep existing imageUrl
      if (editingRecipe && !selectedFile && !imageUrl) {
        imageUrl = editingRecipe.imageUrl || '/placeholder-food.jpg'
      }

      // For new recipes, require an image
      if (!editingRecipe && !imageUrl) {
        alert('Prosím nahrajte obrázok')
        setUploading(false)
        return
      }

      // Use placeholder if no image provided
      if (!imageUrl) {
        imageUrl = '/placeholder-food.jpg'
      }

      const url = editingRecipe ? `/api/recipes/${editingRecipe.id}` : '/api/recipes'
      const method = editingRecipe ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      })

      if (response.ok) {
        await fetchRecipes()
        resetForm()
        setShowAddForm(false)
        setEditingRecipe(null)
        alert(editingRecipe ? 'Recept bol úspešne upravený!' : 'Recept bol úspešne pridaný!')
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Chyba pri ukladaní receptu'
        console.error('Server error:', errorMessage)
        alert(`Chyba: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      alert(`Chyba pri ukladaní receptu: ${error instanceof Error ? error.message : 'Neznáma chyba'}`)
    } finally {
      setUploading(false)
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

  const handleSeedRecipes = async () => {
    if (!confirm('Pridať 6 testovacích receptov do databázy?')) {
      return
    }

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Úspešne pridané ${data.recipes.length} testovacích receptov!`)
        await fetchRecipes()
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Chyba pri pridávaní testovacích receptov: ${errorData.error || 'Neznáma chyba'}`)
      }
    } catch (error) {
      console.error('Error seeding recipes:', error)
      alert('Chyba pri pridávaní testovacích receptov')
    }
  }

  const handleTestDatabase = async () => {
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ Databáza je pripojená a funguje správne!\n\nPočet receptov: ${data.recipeCount}`)
      } else {
        alert(`❌ Chyba pripojenia k databáze:\n\n${data.message}\n\nSkontrolujte:\n${data.check?.join('\n') || ''}`)
      }
    } catch (error) {
      alert('❌ Nepodarilo sa otestovať pripojenie k databáze')
    }
  }

  const handleInitDatabase = async () => {
    if (!confirm('Inicializovať databázu? Toto vytvorí potrebné tabuľky.')) {
      return
    }

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        alert('✅ Databáza bola úspešne inicializovaná!')
      } else {
        alert(`❌ Chyba pri inicializácii: ${data.error}`)
      }
    } catch (error) {
      alert('❌ Nepodarilo sa inicializovať databázu')
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
    setImagePreview(recipe.imageUrl || null)
    setSelectedFile(null)
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
    setSelectedFile(null)
    setImagePreview(null)
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

        <div className="mb-6 flex gap-4 flex-wrap">
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
          <button
            onClick={handleTestDatabase}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
          >
            🔌 Test pripojenia
          </button>
          <button
            onClick={handleInitDatabase}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg"
          >
            🗄️ Inicializovať DB
          </button>
          <button
            onClick={handleSeedRecipes}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
          >
            🌱 Testovacie recepty
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
                  Obrázok jedla *
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Kliknite na nahranie</span> alebo presuňte obrázok sem
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF do 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {(imagePreview || formData.imageUrl) && (
                    <div className="relative">
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                      />
                      {selectedFile && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Nový obrázok
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          setImagePreview(null)
                          if (!editingRecipe) {
                            setFormData({ ...formData, imageUrl: '' })
                          }
                        }}
                        className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors"
                      >
                        Odstrániť
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategória
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Vyberte kategóriu</option>
                    <option value="Hlavné jedlá">Hlavné jedlá</option>
                    <option value="Polievky">Polievky</option>
                    <option value="Šaláty">Šaláty</option>
                    <option value="Dezerty">Dezerty</option>
                    <option value="Pečivo">Pečivo</option>
                    <option value="Prílohy">Prílohy</option>
                    <option value="Predjedlá">Predjedlá</option>
                    <option value="Nápoje">Nápoje</option>
                    <option value="Rýchle jedlá">Rýchle jedlá</option>
                    <option value="Vegetariánske">Vegetariánske</option>
                    <option value="Bezlepkové">Bezlepkové</option>
                  </select>
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
                  disabled={uploading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Nahrávam...
                    </>
                  ) : (
                    editingRecipe ? 'Uložiť zmeny' : 'Pridať recept'
                  )}
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

