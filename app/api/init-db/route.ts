import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs' // Use Node.js runtime

export async function POST() {
  try {
    // Prisma will automatically create tables based on schema
    // Just verify connection and table exists
    await prisma.$connect()
    const count = await prisma.recipe.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection verified. Run "npx prisma migrate dev" to create tables.',
      currentRecipeCount: count,
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Make sure to run: npx prisma migrate dev',
      },
      { status: 500 }
    )
  }
}

