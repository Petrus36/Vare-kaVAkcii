import { NextRequest, NextResponse } from 'next/server'
import { testConnection, getPool, initDatabase } from '@/lib/db'

export const runtime = 'nodejs' // Use Node.js runtime for pg

export async function GET() {
  try {
    const isConnected = await testConnection()
    
    if (isConnected) {
      // Try to run a simple query and initialize database
      const pool = getPool()
      try {
        // Initialize database schema if needed
        await initDatabase()
        
        const result = await pool.query('SELECT COUNT(*) as count FROM recipes')
        
        return NextResponse.json({
          success: true,
          message: 'Database connection successful',
          database: 'PostgreSQL (Neon)',
          recipeCount: result.rows[0]?.count || 0,
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

