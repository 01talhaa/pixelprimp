"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchWithAuth } from "@/lib/client-auth"
import { Loader2, FileText, Clock, CheckCircle, XCircle, DollarSign, Eye, Download } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import jsPDF from "jspdf"

interface Inquiry {
  _id: string
  serviceName: string
  packageName?: string
  packagePrice?: string
  message: string
  status: string
  paymentStatus: string
  invoiceNumber: string
  totalAmount: string
  createdAt: string
  updatedAt: string
  statusHistory?: Array<{
    status: string
    changedBy: string
    changedAt: string
    note?: string
  }>
  adminNotes?: string
  notes?: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  approved: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  paid: "bg-green-500/10 text-green-500 border-green-500/30",
  "in-progress": "bg-purple-500/10 text-purple-500 border-purple-500/30",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  approved: CheckCircle,
  paid: DollarSign,
  "in-progress": Loader2,
  completed: CheckCircle,
  cancelled: XCircle,
}

export function InquiriesSection() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  useEffect(() => {
    loadInquiries()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadInquiries, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadInquiries = async () => {
    try {
      const response = await fetchWithAuth('/api/inquiries')
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      }
    } catch (error) {
      console.error('Error loading inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = (inquiry: Inquiry) => {
    const doc = new jsPDF()
    
    // Set colors
    const primaryColor: [number, number, number] = [14, 165, 233] // Sky-500
    const darkColor: [number, number, number] = [0, 0, 0]
    const grayColor: [number, number, number] = [107, 114, 128]
    
    let yPos = 20
    
    // Header - Company Name
    doc.setFontSize(24)
    doc.setTextColor(...primaryColor)
    doc.text('PIXELPRIMP', 105, yPos, { align: 'center' })
    
    yPos += 10
    doc.setFontSize(16)
    doc.text('INVOICE', 105, yPos, { align: 'center' })
    
    // Line separator
    yPos += 5
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    
    // Invoice Info
    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(...darkColor)
    doc.text(`Invoice Number: ${inquiry.invoiceNumber}`, 20, yPos)
    doc.text(`Date: ${format(new Date(inquiry.createdAt), 'PP')}`, 140, yPos)
    
    yPos += 6
    doc.text(`Status: ${inquiry.status.toUpperCase()}`, 20, yPos)
    doc.text(`Payment: ${inquiry.paymentStatus.toUpperCase()}`, 140, yPos)
    
    // Service Details Section
    yPos += 12
    doc.setFillColor(...primaryColor)
    doc.rect(20, yPos - 5, 170, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('SERVICE DETAILS', 22, yPos)
    
    yPos += 8
    doc.setTextColor(...darkColor)
    doc.setFontSize(10)
    doc.text(`Service: ${inquiry.serviceName}`, 22, yPos)
    
    if (inquiry.packageName) {
      yPos += 6
      doc.text(`Package: ${inquiry.packageName}`, 22, yPos)
    }
    
    if (inquiry.packagePrice) {
      yPos += 6
      doc.text(`Package Price: ${inquiry.packagePrice}`, 22, yPos)
    }
    
    // Project Details Section
    yPos += 12
    doc.setFillColor(...primaryColor)
    doc.rect(20, yPos - 5, 170, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('PROJECT DETAILS', 22, yPos)
    
    yPos += 8
    doc.setTextColor(...darkColor)
    doc.setFontSize(10)
    const messageLines = doc.splitTextToSize(inquiry.message, 166)
    doc.text(messageLines, 22, yPos)
    yPos += messageLines.length * 5
    
    // Amount Section
    yPos += 10
    doc.setFillColor(...primaryColor)
    doc.rect(20, yPos - 5, 170, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('AMOUNT', 22, yPos)
    
    yPos += 8
    doc.setTextColor(...darkColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Amount: ${inquiry.totalAmount}`, 22, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    yPos += 6
    doc.text(`Payment Status: ${inquiry.paymentStatus.toUpperCase()}`, 22, yPos)
    
    // Admin Notes if present
    if (inquiry.adminNotes && yPos < 250) {
      yPos += 12
      doc.setFillColor(...primaryColor)
      doc.rect(20, yPos - 5, 170, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.text('ADMIN NOTES', 22, yPos)
      
      yPos += 8
      doc.setTextColor(...darkColor)
      doc.setFontSize(10)
      const notesLines = doc.splitTextToSize(inquiry.adminNotes, 166)
      doc.text(notesLines, 22, yPos)
      yPos += notesLines.length * 5
    }
    
    // Status History
    if (inquiry.statusHistory && inquiry.statusHistory.length > 0 && yPos < 230) {
      yPos += 12
      doc.setFillColor(...primaryColor)
      doc.rect(20, yPos - 5, 170, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.text('STATUS HISTORY', 22, yPos)
      
      yPos += 8
      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      
      inquiry.statusHistory.forEach((history) => {
        if (yPos > 270) return // Avoid overflow
        doc.text(`${format(new Date(history.changedAt), 'PP p')} - ${history.status.toUpperCase()}`, 22, yPos)
        yPos += 5
        doc.setTextColor(...grayColor)
        doc.text(`By: ${history.changedBy}`, 27, yPos)
        if (history.note) {
          yPos += 5
          doc.text(`Note: ${history.note}`, 27, yPos)
        }
        yPos += 6
        doc.setTextColor(...darkColor)
      })
    }
    
    // Footer
    doc.setDrawColor(...primaryColor)
    doc.line(20, 280, 190, 280)
    doc.setFontSize(9)
    doc.setTextColor(...grayColor)
    doc.text('Thank you for choosing PixelPrimp!', 105, 286, { align: 'center' })
    doc.text('Visit us at: www.pixelprimp.com | WhatsApp: +880 1401-658685', 105, 291, { align: 'center' })
    
    // Save the PDF
    doc.save(`${inquiry.invoiceNumber}.pdf`)
  }

  const InquiryDetailDialog = ({ inquiry }: { inquiry: Inquiry }) => {
    const StatusIcon = statusIcons[inquiry.status] || Clock

    return (
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-sky-500" />
            Invoice Details
          </DialogTitle>
          <DialogDescription>
            Complete information about your service inquiry and invoice
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="p-6 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Invoice Number</p>
                <p className="text-2xl font-bold text-black">{inquiry.invoiceNumber}</p>
              </div>
              <Badge className={statusColors[inquiry.status]}>
                <StatusIcon className={`h-3 w-3 mr-1 ${inquiry.status === 'in-progress' ? 'animate-spin' : ''}`} />
                {inquiry.status.toUpperCase().replace('-', ' ')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created Date</p>
                <p className="font-semibold text-black">
                  {format(new Date(inquiry.createdAt), 'PPP')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-semibold text-black">
                  {format(new Date(inquiry.updatedAt), 'PPP')}
                </p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="font-semibold text-black mb-3">Service Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold text-black">{inquiry.serviceName}</span>
              </div>
              {inquiry.packageName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-semibold text-black">{inquiry.packageName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-sky-600 text-lg">{inquiry.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <Badge variant={inquiry.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                  {inquiry.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="font-semibold text-black mb-3">Your Message</h3>
            <p className="text-sm text-gray-700 p-4 rounded-lg bg-gray-50 border border-gray-200">
              {inquiry.message}
            </p>
          </div>

          {/* Admin Notes */}
          {inquiry.adminNotes && (
            <div>
              <h3 className="font-semibold text-black mb-3">Admin Notes</h3>
              <p className="text-sm text-gray-700 p-4 rounded-lg bg-blue-50 border border-blue-200">
                {inquiry.adminNotes}
              </p>
            </div>
          )}

          {/* Status History */}
          {inquiry.statusHistory && inquiry.statusHistory.length > 0 && (
            <div>
              <h3 className="font-semibold text-black mb-3">Status History</h3>
              <div className="space-y-3">
                {inquiry.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-black">
                          {history.status.toUpperCase().replace('-', ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(history.changedAt), 'PPp')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">by {history.changedBy}</p>
                      {history.note && <p className="text-xs text-gray-600 mt-1">{history.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={() => downloadInvoice(inquiry)}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice (PDF)
            </Button>
          </div>
        </div>
      </DialogContent>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    )
  }

  if (inquiries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Inquiries & Invoices</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No inquiries yet</p>
          <Button asChild>
            <Link href="/services">Browse Services</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Inquiries & Invoices</span>
          <Badge variant="secondary">{inquiries.length} Total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const StatusIcon = statusIcons[inquiry.status] || Clock
            
            return (
              <div
                key={inquiry._id}
                className="p-4 rounded-lg border border-gray-200 hover:border-sky-300 transition-colors bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-black">{inquiry.serviceName}</h3>
                      <Badge className={statusColors[inquiry.status]}>
                        <StatusIcon className={`h-3 w-3 mr-1 ${inquiry.status === 'in-progress' ? 'animate-spin' : ''}`} />
                        {inquiry.status.toUpperCase().replace('-', ' ')}
                      </Badge>
                    </div>
                    {inquiry.packageName && (
                      <p className="text-sm text-gray-600">{inquiry.packageName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-sky-600">{inquiry.totalAmount}</p>
                    <Badge variant={inquiry.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-xs">
                      {inquiry.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-600">
                      Invoice: <span className="font-mono font-semibold text-black">{inquiry.invoiceNumber}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(inquiry.createdAt), 'PPP')}
                    </p>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <InquiryDetailDialog inquiry={inquiry} />
                  </Dialog>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
