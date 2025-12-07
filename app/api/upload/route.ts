import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const runtime = 'nodejs' // Use Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `recipe-${timestamp}-${randomString}.${fileExtension}`

    // Try Vercel Blob first (for production/Vercel)
    // Fallback to local file system for local development
    try {
      const blob = await put(filename, file, {
        access: 'public',
        contentType: file.type,
      })

      return NextResponse.json({ 
        url: blob.url, 
        filename: filename 
      })
    } catch (blobError) {
      console.error('Vercel Blob error:', blobError)
      
      // Fallback to local file system for local development
      if (process.env.NODE_ENV === 'development' || process.env.VERCEL !== '1') {
        try {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          // Create uploads directory if it doesn't exist
          const uploadsDir = join(process.cwd(), 'public', 'uploads')
          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
          }

          const filepath = join(uploadsDir, filename)
          await writeFile(filepath, buffer)

          const publicUrl = `/uploads/${filename}`
          return NextResponse.json({ url: publicUrl, filename })
        } catch (fsError) {
          console.error('File system error:', fsError)
          throw new Error(`Failed to upload: ${blobError instanceof Error ? blobError.message : 'Blob storage error'}. Local fallback also failed.`)
        }
      } else {
        // In production on Vercel, provide detailed error
        const errorMessage = blobError instanceof Error ? blobError.message : 'Unknown blob error'
        throw new Error(`Vercel Blob Storage error: ${errorMessage}. Make sure Vercel Blob is enabled for your project.`)
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
