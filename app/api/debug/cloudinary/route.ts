import { NextResponse } from 'next/server'

// GET /api/debug/cloudinary - Check Cloudinary configuration
export async function GET() {
  const config = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
    apiKey: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
    allConfigured: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
  }

  return NextResponse.json({
    message: 'Cloudinary Configuration Status',
    config,
    note: config.allConfigured 
      ? 'All Cloudinary credentials are configured ✅' 
      : 'Some Cloudinary credentials are missing. Please check your .env file ❌',
  })
}
