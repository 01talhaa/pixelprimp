import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/mongoose'
import Inquiry from '@/lib/models/Inquiry'
import Client from '@/lib/models/Client'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// GET - Get all inquiries for logged-in client
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string

    await dbConnect()

    const inquiries = await Inquiry.find({ clientId })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(inquiries)
  } catch (error: any) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiries' }, { status: 500 })
  }
}

// POST - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    console.log('=== Inquiry Creation Started ===')
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      console.error('No client token found')
      return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 })
    }

    console.log('Token found, verifying...')
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string
    console.log('Client ID from JWT:', clientId)

    const body = await request.json()
    console.log('Request body:', body)
    const { serviceId, serviceName, packageName, packagePrice, message, totalAmount } = body

    if (!serviceId || !serviceName || !message || !totalAmount) {
      console.error('Missing required fields')
      return NextResponse.json(
        { error: 'Service ID, service name, message, and total amount are required' },
        { status: 400 }
      )
    }

    console.log('Connecting to database...')
    await dbConnect()

    // Verify client exists
    console.log('Finding client...')
    const client = await Client.findById(clientId)
    if (!client) {
      console.error('Client not found:', clientId)
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }
    console.log('Client found:', client.name)

    console.log('Generating invoice number...')
    // Generate unique invoice number
    const count = await Inquiry.countDocuments()
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`
    console.log('Generated invoice number:', invoiceNumber)

    console.log('Creating inquiry...')
    const inquiry = new Inquiry({
      clientId,
      serviceId,
      serviceName,
      packageName,
      packagePrice,
      message,
      totalAmount,
      invoiceNumber, // Add it directly here
      status: 'pending',
      paymentStatus: 'unpaid',
      statusHistory: [
        {
          status: 'pending',
          changedBy: client.name,
          changedAt: new Date(),
          note: 'Inquiry submitted',
        },
      ],
    })

    console.log('Saving inquiry...')
    await inquiry.save()

    console.log('Inquiry created successfully:', inquiry._id, inquiry.invoiceNumber)
    return NextResponse.json(inquiry, { status: 201 })
  } catch (error: any) {
    console.error('Error creating inquiry:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ error: error.message || 'Failed to create inquiry' }, { status: 500 })
  }
}
