# Vareška v Akcii - Food Recipes Website

A modern food recipes website built with Next.js, TypeScript, and Tailwind CSS, featuring an admin panel for managing recipes.

## Features

- 🍳 Beautiful food recipe cards with images
- 📱 Recipe detail pages with TikTok video links
- 🔐 Admin panel with authentication
- ➕ Add, edit, and delete recipes
- 🗄️ PostgreSQL (Neon) database integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database (or any PostgreSQL database)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

**Note**: 
- For Neon, get your connection string from the Neon dashboard
- The connection string should look like: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require`
- The database schema will be automatically created on first use

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
    └── db.ts             # PostgreSQL database functions
```

## Image Uploads

Images are uploaded and stored in the `public/uploads/` directory. The upload API endpoint (`/api/upload`) handles:
- File type validation (images only)
- File size validation (max 5MB)
- Automatic unique filename generation
- Storage in `public/uploads/` directory

Uploaded images are accessible via `/uploads/filename.jpg` and the path is stored in the database.

## Database Schema

Recipes are stored in a PostgreSQL table with the following columns:
- `name`: Recipe name (required)
- `description`: Short description
- `imageUrl`: Path to the uploaded image file (e.g., `/uploads/1234567890-abc.jpg`) (required)
- `recipe`: Full recipe instructions (required)
- `ingredients`: List of ingredients (one per line, required)
- `cookingTime`: Cooking time (e.g., "30 min")
- `difficulty`: Difficulty level (Ľahká, Stredná, Náročná)
- `servings`: Number of servings
- `category`: Recipe category (e.g., "Hlavné jedlá", "Dezerty")
- `tiktokUrl`: Link to TikTok video (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp (when edited)

## License

Private project

