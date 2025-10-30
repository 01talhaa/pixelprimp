import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongoose'
import Client from '@/lib/models/Client'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

// GET - Get current client
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('client_token')

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token
    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    await dbConnect()
    const client = await Client.findById(payload.id).select('-password -refreshToken')

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    console.log('Client ME endpoint - avatar:', client.avatar)
    return NextResponse.json({ client })
  } catch (error: any) {
    console.error('Get client error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
