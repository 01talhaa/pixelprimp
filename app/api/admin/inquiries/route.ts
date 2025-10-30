import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Inquiry from '@/lib/models/Inquiry'
import Client from '@/lib/models/Client'

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

// GET - Get all inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    await dbConnect()

    const filter: any = {}
    if (status) filter.status = status
    if (clientId) filter.clientId = clientId

    const inquiries = await Inquiry.find(filter)
      .populate('clientId', 'name email phone company avatar')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(inquiries)
  } catch (error: any) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiries' }, { status: 500 })
  }
}
