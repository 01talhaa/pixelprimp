import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongoose'
import Client from '@/lib/models/Client'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

// POST - Refresh access token
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('client_refresh_token')

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    // Verify refresh token
    let payload
    try {
      const verified = await jwtVerify(refreshToken.value, JWT_SECRET)
      payload = verified.payload
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Check if it's a refresh token
    if (payload.type !== 'client_refresh') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      )
    }

    await dbConnect()
    
    // Get client and verify refresh token matches
    const client = await Client.findById(payload.id).select('+refreshToken')
    
    if (!client || client.refreshToken !== refreshToken.value) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Create new access token (15 minutes)
    const newAccessToken = await new SignJWT({ 
      id: client._id.toString(),
      email: client.email,
      type: 'client'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(JWT_SECRET)

    // Set new access token cookie
    cookieStore.set('client_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })

    return NextResponse.json(
      { 
        message: 'Token refreshed successfully',
        accessToken: newAccessToken
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
  }
}
