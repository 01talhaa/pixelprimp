import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

// POST /api/upload - Upload images to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Support both single file and multiple files
    let files: File[] = []
    const singleFile = formData.get('file') as File | null
    const multipleFiles = formData.getAll('files') as File[]
    
    if (singleFile) {
      files = [singleFile]
    } else if (multipleFiles && multipleFiles.length > 0) {
      files = multipleFiles
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    console.log(`Uploading ${files.length} file(s)...`)

    const uploadPromises = files.map(async (file) => {
      try {
        console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`)
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const url = await uploadToCloudinary(buffer, 'pqrix-avatars')
        console.log(`Successfully uploaded: ${file.name}`)
        return url
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err)
        throw err
      }
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    // If single file, return { url: ... } for backward compatibility
    if (files.length === 1) {
      return NextResponse.json({
        success: true,
        url: uploadedUrls[0],
        data: uploadedUrls,
      })
    }

    // If multiple files, return { data: [...] }
    return NextResponse.json({
      success: true,
      data: uploadedUrls,
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload files'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
