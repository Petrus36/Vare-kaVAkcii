import { NextRequest, NextResponse } from 'next/server'
import { getRecipes, createRecipe } from '@/lib/neo4j'

export async function GET() {
  try {
    const recipes = await getRecipes()
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error in GET /api/recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const recipe = await createRecipe({
      name: body.name,
      description: body.description || '',
      imageUrl: body.imageUrl,
      recipe: body.recipe,
      ingredients: body.ingredients || '',
      cookingTime: body.cookingTime || '',
      difficulty: body.difficulty || '',
      servings: body.servings || '',
      category: body.category || '',
      tiktokUrl: body.tiktokUrl || '',
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'Failed to create recipe' },
        { status: 500 }
      )
    }

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/recipes:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}

