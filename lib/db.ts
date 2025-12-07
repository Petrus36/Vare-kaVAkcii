import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })

    // Test connection
    pool.query('SELECT NOW()').catch((error) => {
      console.error('PostgreSQL connection error:', error)
      console.error('Please check your DATABASE_URL in .env.local file')
    })
  }

  return pool
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool()
    const result = await pool.query('SELECT NOW()')
    return result.rows.length > 0
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Initialize database schema
export async function initDatabase(): Promise<void> {
  const pool = getPool()
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image_url VARCHAR(500),
      recipe TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      cooking_time VARCHAR(50),
      difficulty VARCHAR(50),
      servings VARCHAR(50),
      category VARCHAR(100),
      tiktok_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    )
  `)

  // Create index for faster queries
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC)
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category)
  `)
}

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
  const pool = getPool()
  try {
    const result = await pool.query(
      'SELECT * FROM recipes ORDER BY created_at DESC'
    )

    return result.rows.map((row) => ({
      id: row.id.toString(),
      name: row.name || '',
      description: row.description || '',
      imageUrl: row.image_url || '',
      recipe: row.recipe || '',
      ingredients: row.ingredients || '',
      cookingTime: row.cooking_time || '',
      difficulty: row.difficulty || '',
      servings: row.servings || '',
      category: row.category || '',
      tiktokUrl: row.tiktok_url || '',
    }))
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const pool = getPool()
  try {
    const result = await pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name || '',
      description: row.description || '',
      imageUrl: row.image_url || '',
      recipe: row.recipe || '',
      ingredients: row.ingredients || '',
      cookingTime: row.cooking_time || '',
      difficulty: row.difficulty || '',
      servings: row.servings || '',
      category: row.category || '',
      tiktokUrl: row.tiktok_url || '',
    }
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

export async function createRecipe(recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> {
  const pool = getPool()
  try {
    // Validate required fields
    if (!recipeData.name || !recipeData.recipe || !recipeData.ingredients) {
      throw new Error('Missing required fields: name, recipe, or ingredients')
    }

    const result = await pool.query(
      `INSERT INTO recipes (
        name, description, image_url, recipe, ingredients,
        cooking_time, difficulty, servings, category, tiktok_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        recipeData.name,
        recipeData.description || '',
        recipeData.imageUrl || '/placeholder-food.jpg',
        recipeData.recipe,
        recipeData.ingredients || '',
        recipeData.cookingTime || '',
        recipeData.difficulty || '',
        recipeData.servings || '',
        recipeData.category || '',
        recipeData.tiktokUrl || '',
      ]
    )

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name || '',
      description: row.description || '',
      imageUrl: row.image_url || '',
      recipe: row.recipe || '',
      ingredients: row.ingredients || '',
      cookingTime: row.cooking_time || '',
      difficulty: row.difficulty || '',
      servings: row.servings || '',
      category: row.category || '',
      tiktokUrl: row.tiktok_url || '',
    }
  } catch (error) {
    console.error('Error creating recipe:', error)
    throw error
  }
}

export async function updateRecipe(id: string, recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> {
  const pool = getPool()
  try {
    const result = await pool.query(
      `UPDATE recipes SET
        name = $1,
        description = $2,
        image_url = $3,
        recipe = $4,
        ingredients = $5,
        cooking_time = $6,
        difficulty = $7,
        servings = $8,
        category = $9,
        tiktok_url = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *`,
      [
        recipeData.name,
        recipeData.description || '',
        recipeData.imageUrl || '/placeholder-food.jpg',
        recipeData.recipe,
        recipeData.ingredients || '',
        recipeData.cookingTime || '',
        recipeData.difficulty || '',
        recipeData.servings || '',
        recipeData.category || '',
        recipeData.tiktokUrl || '',
        id,
      ]
    )

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id.toString(),
      name: row.name || '',
      description: row.description || '',
      imageUrl: row.image_url || '',
      recipe: row.recipe || '',
      ingredients: row.ingredients || '',
      cookingTime: row.cooking_time || '',
      difficulty: row.difficulty || '',
      servings: row.servings || '',
      category: row.category || '',
      tiktokUrl: row.tiktok_url || '',
    }
  } catch (error) {
    console.error('Error updating recipe:', error)
    throw error
  }
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const pool = getPool()
  try {
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1',
      [id]
    )

    return result.rowCount ? result.rowCount > 0 : false
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return false
  }
}

