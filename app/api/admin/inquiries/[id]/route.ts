import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Inquiry from '@/lib/models/Inquiry'

// Verify admin credentials
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [username, password] = credentials.split(':')

  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  )
}

// GET - Get single inquiry (admin only)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const inquiry = await Inquiry.findById(id)
      .populate('clientId', 'name email phone company avatar')
      .lean()

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiry' }, { status: 500 })
  }
}

// PUT - Update inquiry status (admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, paymentStatus, adminNotes, totalAmount, changedBy } = body

    await dbConnect()

    const inquiry = await Inquiry.findById(id)

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    let statusChanged = false

    // Update status
    if (status && status !== inquiry.status) {
      inquiry.status = status
      statusChanged = true
    }

    // Update payment status
    if (paymentStatus && paymentStatus !== inquiry.paymentStatus) {
      inquiry.paymentStatus = paymentStatus
      statusChanged = true
    }

    // Update admin notes
    if (adminNotes !== undefined) {
      inquiry.adminNotes = adminNotes
    }

    // Update total amount
    if (totalAmount !== undefined) {
      inquiry.totalAmount = totalAmount
    }

    // Add to status history if status changed
    if (statusChanged) {
      inquiry.statusHistory.push({
        status: status || inquiry.status,
        changedBy: changedBy || 'Admin',
        changedAt: new Date(),
        note: adminNotes || '',
      })
    }

    await inquiry.save()

    // Populate client data for response
    await inquiry.populate('clientId', 'name email phone company avatar')

    return NextResponse.json(inquiry)
  } catch (error: any) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to update inquiry' }, { status: 500 })
  }
}

// DELETE - Delete inquiry (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const inquiry = await Inquiry.findByIdAndDelete(id)

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Inquiry deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete inquiry' }, { status: 500 })
  }
}
