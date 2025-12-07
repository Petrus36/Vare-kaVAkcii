import { NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

export const runtime = 'nodejs' // Use Node.js runtime for pg

export async function POST() {
  try {
    await initDatabase()
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

