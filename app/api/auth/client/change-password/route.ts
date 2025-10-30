import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongoose'
import Client from '@/lib/models/Client'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

// POST - Change password
export async function POST(request: NextRequest) {
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
    
    // Get client with password
    const client = await Client.findById(payload.id).select('+password')
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Please provide current and new password' },
        { status: 400 }
      )
    }

    // Verify current password
    const isPasswordCorrect = await client.comparePassword(currentPassword)
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Update password
    client.password = newPassword
    await client.save()

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 401 })
  }
}
