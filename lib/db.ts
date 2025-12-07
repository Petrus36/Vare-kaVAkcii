import { prisma } from './prisma'

export interface Recipe {
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

export async function getRecipes(): Promise<Recipe[]> {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return recipes.map((recipe) => ({
      id: recipe.id.toString(),
      name: recipe.name,
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '/placeholder-food.jpg',
      recipe: recipe.recipe,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl || '',
    }))
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    if (!recipe) {
      return null
    }

    return {
      id: recipe.id.toString(),
      name: recipe.name,
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '/placeholder-food.jpg',
      recipe: recipe.recipe,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl || '',
    }
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

export async function createRecipe(recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> {
  try {
    // Validate required fields
    if (!recipeData.name || !recipeData.recipe || !recipeData.ingredients) {
      throw new Error('Missing required fields: name, recipe, or ingredients')
    }

    const recipe = await prisma.recipe.create({
      data: {
        name: recipeData.name,
        description: recipeData.description || '',
        imageUrl: recipeData.imageUrl || '/placeholder-food.jpg',
        recipe: recipeData.recipe,
        ingredients: recipeData.ingredients,
        cookingTime: recipeData.cookingTime || '',
        difficulty: recipeData.difficulty || '',
        servings: recipeData.servings || '',
        category: recipeData.category || '',
        tiktokUrl: recipeData.tiktokUrl || '',
      },
    })

    return {
      id: recipe.id.toString(),
      name: recipe.name,
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '/placeholder-food.jpg',
      recipe: recipe.recipe,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl || '',
    }
  } catch (error) {
    console.error('Error creating recipe:', error)
    throw error
  }
}

export async function updateRecipe(id: string, recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> {
  try {
    const recipe = await prisma.recipe.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: recipeData.name,
        description: recipeData.description || '',
        imageUrl: recipeData.imageUrl || '/placeholder-food.jpg',
        recipe: recipeData.recipe,
        ingredients: recipeData.ingredients,
        cookingTime: recipeData.cookingTime || '',
        difficulty: recipeData.difficulty || '',
        servings: recipeData.servings || '',
        category: recipeData.category || '',
        tiktokUrl: recipeData.tiktokUrl || '',
      },
    })

    return {
      id: recipe.id.toString(),
      name: recipe.name,
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '/placeholder-food.jpg',
      recipe: recipe.recipe,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl || '',
    }
  } catch (error) {
    console.error('Error updating recipe:', error)
    throw error
  }
}

export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    await prisma.recipe.delete({
      where: {
        id: parseInt(id),
      },
    })
    return true
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return false
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}
