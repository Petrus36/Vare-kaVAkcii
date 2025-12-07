import { NextRequest, NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs' // Use Node.js runtime

export async function GET() {
  try {
    const isConnected = await testConnection()
    
    if (isConnected) {
      try {
        const recipeCount = await prisma.recipe.count()
        
        return NextResponse.json({
          success: true,
          message: 'Database connection successful',
          database: 'PostgreSQL (Neon) with Prisma',
          recipeCount: recipeCount,
        })
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'Connection test passed but query failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 })
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to database',
        check: [
          'Is DATABASE_URL set in .env.local?',
          'Is your Neon database accessible?',
          'Have you run: npx prisma migrate dev',
          'Check your connection string format',
        ],
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}

