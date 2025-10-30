import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Client from '@/lib/models/Client'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

// POST - Client Signup
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Please provide name, email, and password' },
        { status: 400 }
      )
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ email: body.email })
    if (existingClient) {
      return NextResponse.json(
        { error: 'Client with this email already exists' },
        { status: 400 }
      )
    }

    // Create new client
    const client = await Client.create({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone || '',
      company: body.company || '',
      avatar: body.avatar || '',
    })

    // Create access token (15 minutes)
    const accessToken = await new SignJWT({ 
      id: client._id.toString(),
      email: client.email,
      type: 'client'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(JWT_SECRET)

    // Create refresh token (7 days)
    const refreshToken = await new SignJWT({ 
      id: client._id.toString(),
      email: client.email,
      type: 'client_refresh'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Store refresh token in database
    client.refreshToken = refreshToken
    await client.save()

    // Set cookies
    const cookieStore = await cookies()
    cookieStore.set('client_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
    
    cookieStore.set('client_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Remove password from response
    const clientData = client.toObject()
    delete clientData.password

    return NextResponse.json(
      { 
        message: 'Client registered successfully',
        client: clientData,
        accessToken,
        refreshToken
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
