import { NextRequest, NextResponse } from 'next/server'
import { getRecipeById, updateRecipe, deleteRecipe } from '@/lib/db'

export const runtime = 'nodejs' // Use Node.js runtime for pg

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const recipe = await getRecipeById(params.id)
    
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error in GET /api/recipes/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.recipe || !body.ingredients) {
      return NextResponse.json(
        { error: 'Názov, recept a ingrediencie sú povinné polia' },
        { status: 400 }
      )
    }

    const recipe = await updateRecipe(params.id, {
      name: body.name,
      description: body.description || '',
      imageUrl: body.imageUrl || '/placeholder-food.jpg',
      recipe: body.recipe,
      ingredients: body.ingredients,
      cookingTime: body.cookingTime || '',
      difficulty: body.difficulty || '',
      servings: body.servings || '',
      category: body.category || '',
      tiktokUrl: body.tiktokUrl || '',
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recept sa nenašiel alebo sa nepodarilo aktualizovať. Skontrolujte pripojenie k databáze.' },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error in PUT /api/recipes/[id]:', error)
    const errorMessage = error instanceof Error ? error.message : 'Neznáma chyba'
    return NextResponse.json(
      { error: `Chyba pri aktualizácii receptu: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await deleteRecipe(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/recipes/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}

