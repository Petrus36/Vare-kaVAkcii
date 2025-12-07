import { NextRequest, NextResponse } from 'next/server'
import { createRecipe } from '@/lib/db'

export const runtime = 'nodejs' // Use Node.js runtime for pg

const testRecipes = [
  {
    name: 'Špagety Carbonara',
    description: 'Klasické talianske špagety s vajíčkami, slaninou a parmezánom. Jednoduchý a chutný recept, ktorý zvládne každý.',
    imageUrl: '/placeholder-food.jpg',
    category: 'Hlavné jedlá',
    cookingTime: '20 min',
    difficulty: 'Stredná',
    servings: '4 porcie',
    ingredients: `400g špagiet
200g slaniny
4 vajcia
100g parmezánu
2 strúčiky cesnaku
Čierne korenie
Soľ`,
    recipe: `1. Uvaríme špagety podľa návodu na obale v osolenej vode.
2. Medzitým si na panvici opečieme nakrájanú slaninu do zlatista.
3. V miske rozmiešame vajcia s nastrúhaným parmezánom.
4. Keď sú špagety hotové, odcedíme ich a pridáme k slanine.
5. Odstavíme z ohňa a rýchlo premiešame s vajíčkovou zmesou.
6. Podávame s ďalším parmezánom a čiernym korením.`,
    tiktokUrl: '',
  },
  {
    name: 'Čokoládový koláč',
    description: 'Vlhký a nadýchaný čokoládový koláč, ktorý sa roztopí v ústach. Perfektný dezert pre každú príležitosť.',
    imageUrl: '/placeholder-food.jpg',
    category: 'Dezerty',
    cookingTime: '45 min',
    difficulty: 'Ľahká',
    servings: '8 porcií',
    ingredients: `200g tmavej čokolády
200g masla
4 vajcia
200g cukru
100g múky
50g kakaa
1 lyžička prášku do pečiva`,
    recipe: `1. Roztopíme čokoládu s maslom v dvojitom kotlíku.
2. V miske vyšľaháme vajcia s cukrom do pene.
3. Pridáme vychladnutú čokoládovú zmes.
4. Premiešame múku, kakao a prášok do pečiva a pridáme k zmesi.
5. Nalejeme do vymasteného a vysypaného formátu.
6. Pečieme na 180°C asi 30-35 minút.
7. Necháme vychladnúť pred podávaním.`,
    tiktokUrl: '',
  },
  {
    name: 'Kuracie prsia s ryžou',
    description: 'Šťavnaté kuracie prsia s aromatickou ryžou a zeleninou. Zdravé a výživné jedlo pre celú rodinu.',
    imageUrl: '/placeholder-food.jpg',
    category: 'Hlavné jedlá',
    cookingTime: '35 min',
    difficulty: 'Ľahká',
    servings: '4 porcie',
    ingredients: `4 kuracie prsia
300g ryže
1 cibuľa
2 strúčiky cesnaku
1 paprika
200ml kuracieho vývaru
Olej
Soľ, korenie
Petržlen`,
    recipe: `1. Kuracie prsia nakrájame na plátky a osolíme.
2. Na panvici opečieme prsia z oboch strán do zlatista.
3. Pridáme nakrájanú cibuľu a cesnak, restujeme 2 minúty.
4. Pridáme nakrájanú papriku a ryžu.
5. Zalejeme vývarom a dusíme pod pokrievkou 20 minút.
6. Pred podávaním posypeme nasekaným petržlenom.`,
    tiktokUrl: '',
  },
  {
    name: 'Zeleninová polievka',
    description: 'Výživná a zdravá zeleninová polievka plná vitamínov. Ideálna na chladné dni.',
    imageUrl: '/placeholder-food.jpg',
    category: 'Polievky',
    cookingTime: '30 min',
    difficulty: 'Ľahká',
    servings: '6 porcií',
    ingredients: `2 mrkvy
2 zelerové stonky
1 cibuľa
2 zemiaky
1 paradajka
1,5l zeleninového vývaru
Olej
Soľ, korenie
Bazalka`,
    recipe: `1. Všetku zeleninu nakrájame na kocky.
2. Na panvici orestujeme cibuľu do sklenena.
3. Pridáme zvyšnú zeleninu a restujeme 5 minút.
4. Zalejeme vývarom a varíme 20 minút.
5. Polievku môžeme rozmixovať alebo nechať s kúskami zeleniny.
6. Ochutíme soľou, korením a čerstvou bazalkou.`,
    tiktokUrl: '',
  },
  {
    name: 'Pizza Margherita',
    description: 'Klasická talianska pizza s paradajkami, mozzarellou a bazalkou. Jednoduchá a vždy chutná.',
    imageUrl: '/placeholder-food.jpg',
    category: 'Hlavné jedlá',
    cookingTime: '25 min',
    difficulty: 'Stredná',
    servings: '2-3 porcie',
    ingredients: `500g pizzového cesta
200ml paradajkového pretlaku
250g mozzarelly
Čerstvá bazalka
Olej
Soľ, oregan`,
    recipe: `1. Rozvaľkáme cesto na pizzu.
2. Potrieme pretlakom a posypeme oreganom.
3. Pridáme nakrájanú mozzarellu.
4. Pečieme na 220°C 12-15 minút.
5. Po upečení pridáme čerstvú bazalku a pokvapkáme olejom.`,
    tiktokUrl: '',
  },
  {
    name: 'César šalát',
    description: 'Klasický šalát s kuracím mäsom, parmezánom a césar dresingom. Svieže a výživné jedlo.',
    imageUrl: '/placeholder-food.jpg',
    category: 'Šaláty',
    cookingTime: '15 min',
    difficulty: 'Ľahká',
    servings: '4 porcie',
    ingredients: `1 hlávka rímskeho šalátu
300g kuracieho mäsa
100g parmezánu
100g krutónov
2 vajcia
Cesnak
Ančovičky
Olivový olej
Citrónová šťava`,
    recipe: `1. Kuracie mäso opečieme a nakrájame na plátky.
2. Šalát umyjeme a natrháme na kúsky.
3. Pripravíme dresing z ančovičiek, cesnaku, oleja a citrónovej šťavy.
4. Všetko zmiešame v miske.
5. Pridáme krutóny a nastrúhaný parmezán.
6. Podávame ihneď.`,
    tiktokUrl: '',
  },
]

export async function POST(request: NextRequest) {
  try {
    const addedRecipes = []

    for (const recipe of testRecipes) {
      const created = await createRecipe(recipe)
      if (created) {
        addedRecipes.push(created.name)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${addedRecipes.length} test recipes`,
      recipes: addedRecipes,
    })
  } catch (error) {
    console.error('Error seeding recipes:', error)
    return NextResponse.json(
      { error: 'Failed to seed recipes' },
      { status: 500 }
    )
  }
}

