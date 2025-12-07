import { NextRequest, NextResponse } from 'next/server'
import { getRecipes, createRecipe } from '@/lib/db'

export const runtime = 'nodejs' // Use Node.js runtime for pg

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
    
    // Validate required fields
    if (!body.name || !body.recipe || !body.ingredients) {
      return NextResponse.json(
        { error: 'Názov, recept a ingrediencie sú povinné polia' },
        { status: 400 }
      )
    }

    try {
      const recipe = await createRecipe({
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
          { error: 'Nepodarilo sa vytvoriť recept. Skontrolujte pripojenie k databáze.' },
          { status: 500 }
        )
      }

      return NextResponse.json(recipe, { status: 201 })
    } catch (dbError) {
      console.error('Database error in POST /api/recipes:', dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : 'Neznáma databázová chyba'
      
      // Check if it's a connection error
      if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('timeout')) {
        return NextResponse.json(
          { 
            error: 'Nepodarilo sa pripojiť k databáze. Skontrolujte, či je DATABASE_URL správne nakonfigurovaný v .env.local',
            details: errorMessage,
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: `Chyba pri vytváraní receptu: ${errorMessage}`,
          details: dbError instanceof Error ? dbError.stack : undefined,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in POST /api/recipes:', error)
    const errorMessage = error instanceof Error ? error.message : 'Neznáma chyba'
    return NextResponse.json(
      { error: `Chyba pri spracovaní požiadavky: ${errorMessage}` },
      { status: 500 }
    )
  }
}

