# Vareška v Akcii - Food Recipes Website

A modern food recipes website built with Next.js, TypeScript, and Tailwind CSS, featuring an admin panel for managing recipes.

## Features

- 🍳 Beautiful food recipe cards with images
- 📱 Recipe detail pages with TikTok video links
- 🔐 Admin panel with authentication
- ➕ Add, edit, and delete recipes
- 🗄️ Neo4j database integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neo4j

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neo4j database running (local or remote)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **Username**: `admin`
- **Password**: `admin123`

You can change these credentials in `app/admin/page.tsx`.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin login page
│   ├── recipe/[id]/      # Recipe detail page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── AdminPanel.tsx    # Admin management panel
│   ├── FoodCard.tsx      # Recipe card component
│   ├── Footer.tsx        # Footer component
│   └── Navbar.tsx        # Navigation bar
└── lib/
    └── neo4j.ts          # Neo4j database functions
```

## Database Schema

Recipes are stored as nodes in Neo4j with the following properties:
- `name`: Recipe name
- `description`: Short description
- `imageUrl`: URL to the recipe image
- `recipe`: Full recipe text
- `tiktokUrl`: Link to TikTok video (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp (when edited)

## License

Private project

