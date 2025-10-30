import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/mongoose'
import Inquiry from '@/lib/models/Inquiry'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// GET - Get single inquiry
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string

    await dbConnect()

    const inquiry = await Inquiry.findOne({ _id: id, clientId }).lean()

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiry' }, { status: 500 })
  }
}

// PUT - Update inquiry (client can only update notes)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string

    const body = await request.json()
    const { notes } = body

    await dbConnect()

    const inquiry = await Inquiry.findOne({ _id: id, clientId })

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    if (notes !== undefined) {
      inquiry.notes = notes
    }

    await inquiry.save()

    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to update inquiry' }, { status: 500 })
  }
}

// DELETE - Cancel inquiry
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.cookies.get('client_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const clientId = payload.id as string

    await dbConnect()

    const inquiry = await Inquiry.findOne({ _id: id, clientId })

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    // Only allow cancellation if not completed or cancelled
    if (inquiry.status === 'completed' || inquiry.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot cancel completed or already cancelled inquiry' },
        { status: 400 }
      )
    }

    inquiry.status = 'cancelled'
    inquiry.statusHistory.push({
      status: 'cancelled',
      changedBy: 'Client',
      changedAt: new Date(),
      note: 'Cancelled by client',
    })

    await inquiry.save()

    return NextResponse.json({ message: 'Inquiry cancelled successfully' })
  } catch (error: any) {
    console.error('Error cancelling inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to cancel inquiry' }, { status: 500 })
  }
}
