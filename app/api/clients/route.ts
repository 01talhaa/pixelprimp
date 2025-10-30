import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Client from '@/lib/models/Client'

// GET all clients
export async function GET() {
  try {
    await dbConnect()
    const clients = await Client.find({}).select('-password').sort({ createdAt: -1 })
    return NextResponse.json(clients)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST create new client
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    // Check if client already exists
    const existingClient = await Client.findOne({ email: body.email })
    if (existingClient) {
      return NextResponse.json(
        { error: 'Client with this email already exists' },
        { status: 400 }
      )
    }

    const client = await Client.create(body)
    
    // Remove password from response
    const clientData = client.toObject()
    delete clientData.password

    return NextResponse.json(clientData, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
