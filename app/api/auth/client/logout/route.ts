import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// POST - Client Logout
export async function POST() {
  try {
    // Clear both access and refresh token cookies
    const cookieStore = await cookies()
    cookieStore.delete('client_token')
    cookieStore.delete('client_refresh_token')

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
