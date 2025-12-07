import neo4j, { Driver, Session } from 'neo4j-driver'

let driver: Driver | null = null

export function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687'
    const user = process.env.NEO4J_USER || 'neo4j'
    const password = process.env.NEO4J_PASSWORD || 'password'

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  }

  return driver
}

export async function getSession(): Promise<Session> {
  const driver = getDriver()
  return driver.session()
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
  const session = await getSession()
  try {
    const result = await session.run(
      'MATCH (r:Recipe) RETURN r ORDER BY r.createdAt DESC'
    )

    return result.records.map((record) => {
      const recipe = record.get('r').properties
      return {
        id: record.get('r').identity.toString(),
        name: recipe.name || '',
        description: recipe.description || '',
        imageUrl: recipe.imageUrl || '',
        recipe: recipe.recipe || '',
        ingredients: recipe.ingredients || '',
        cookingTime: recipe.cookingTime || '',
        difficulty: recipe.difficulty || '',
        servings: recipe.servings || '',
        category: recipe.category || '',
        tiktokUrl: recipe.tiktokUrl || '',
      }
    })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  } finally {
    await session.close()
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const session = await getSession()
  try {
    const result = await session.run(
      'MATCH (r:Recipe) WHERE id(r) = $id RETURN r',
      { id: neo4j.int(id) }
    )

    if (result.records.length === 0) {
      return null
    }

    const recipe = result.records[0].get('r').properties
    return {
      id: result.records[0].get('r').identity.toString(),
      name: recipe.name || '',
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '',
      recipe: recipe.recipe || '',
      ingredients: recipe.ingredients || '',
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl || '',
    }
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  } finally {
    await session.close()
  }
}

export async function createRecipe(recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> {
  const session = await getSession()
  try {
    const result = await session.run(
      `CREATE (r:Recipe {
        name: $name,
        description: $description,
        imageUrl: $imageUrl,
        recipe: $recipe,
        ingredients: $ingredients,
        cookingTime: $cookingTime,
        difficulty: $difficulty,
        servings: $servings,
        category: $category,
        tiktokUrl: $tiktokUrl,
        createdAt: datetime()
      })
      RETURN r`,
      {
        name: recipeData.name,
        description: recipeData.description || '',
        imageUrl: recipeData.imageUrl,
        recipe: recipeData.recipe,
        ingredients: recipeData.ingredients || '',
        cookingTime: recipeData.cookingTime || '',
        difficulty: recipeData.difficulty || '',
        servings: recipeData.servings || '',
        category: recipeData.category || '',
        tiktokUrl: recipeData.tiktokUrl || '',
      }
    )

    if (result.records.length === 0) {
      return null
    }

    const recipe = result.records[0].get('r').properties
    return {
      id: result.records[0].get('r').identity.toString(),
      name: recipe.name || '',
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '',
      recipe: recipe.recipe || '',
      ingredients: recipe.ingredients || '',
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl || '',
    }
  } catch (error) {
    console.error('Error creating recipe:', error)
    return null
  } finally {
    await session.close()
  }
}

export async function updateRecipe(id: string, recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> {
  const session = await getSession()
  try {
    const result = await session.run(
      `MATCH (r:Recipe)
       WHERE id(r) = $id
       SET r.name = $name,
           r.description = $description,
           r.imageUrl = $imageUrl,
           r.recipe = $recipe,
           r.ingredients = $ingredients,
           r.cookingTime = $cookingTime,
           r.difficulty = $difficulty,
           r.servings = $servings,
           r.category = $category,
           r.tiktokUrl = $tiktokUrl,
           r.updatedAt = datetime()
       RETURN r`,
      {
        id: neo4j.int(id),
        name: recipeData.name,
        description: recipeData.description || '',
        imageUrl: recipeData.imageUrl,
        recipe: recipeData.recipe,
        ingredients: recipeData.ingredients || '',
        cookingTime: recipeData.cookingTime || '',
        difficulty: recipeData.difficulty || '',
        servings: recipeData.servings || '',
        category: recipeData.category || '',
        tiktokUrl: recipeData.tiktokUrl || '',
      }
    )

    if (result.records.length === 0) {
      return null
    }

    const recipe = result.records[0].get('r').properties
    return {
      id: result.records[0].get('r').identity.toString(),
      name: recipe.name || '',
      description: recipe.description || '',
      imageUrl: recipe.imageUrl || '',
      recipe: recipe.recipe || '',
      ingredients: recipe.ingredients || '',
      cookingTime: recipe.cookingTime || '',
      difficulty: recipe.difficulty || '',
      servings: recipe.servings || '',
      category: recipe.category || '',
      tiktokUrl: recipe.tiktokUrl || '',
    }
  } catch (error) {
    console.error('Error updating recipe:', error)
    return null
  } finally {
    await session.close()
  }
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const session = await getSession()
  try {
    const result = await session.run(
      'MATCH (r:Recipe) WHERE id(r) = $id DELETE r RETURN count(r) as deleted',
      { id: neo4j.int(id) }
    )

    return result.records[0].get('deleted').toNumber() > 0
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return false
  } finally {
    await session.close()
  }
}

