import { NextRequest, NextResponse } from 'next/server'
import { getRecipeById, updateRecipe, deleteRecipe } from '@/lib/neo4j'

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
    const recipe = await updateRecipe(params.id, {
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
        { error: 'Recipe not found or failed to update' },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error in PUT /api/recipes/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to update recipe' },
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

