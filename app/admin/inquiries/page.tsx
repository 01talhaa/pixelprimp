"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  FileText, 
  Loader2, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  RefreshCw,
  Filter
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import Image from "next/image"

interface Inquiry {
  _id: string
  clientId: any
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
  adminNotes?: string
  notes?: string
  statusHistory?: Array<{
    status: string
    changedBy: string
    changedAt: string
    note?: string
  }>
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const paymentStatusOptions = [
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  approved: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  paid: "bg-green-500/10 text-green-600 border-green-500/30",
  "in-progress": "bg-purple-500/10 text-purple-600 border-purple-500/30",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/30",
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  approved: CheckCircle,
  paid: DollarSign,
  "in-progress": Loader2,
  completed: CheckCircle,
  cancelled: XCircle,
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null)
  const [editForm, setEditForm] = useState({
    status: "",
    paymentStatus: "",
    totalAmount: "",
    adminNotes: "",
  })

  useEffect(() => {
    loadInquiries()
  }, [filterStatus])

  const loadInquiries = async () => {
    setLoading(true)
    try {
      // Use the same credentials from environment that other admin pages use
      const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'
      const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const credentials = btoa(`${username}:${password}`)
      
      const url = filterStatus && filterStatus !== "all" 
        ? `/api/admin/inquiries?status=${filterStatus}`
        : '/api/admin/inquiries'
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      } else {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        throw new Error(`Failed to load inquiries: ${response.status} ${errorText}`)
      }
    } catch (error: any) {
      console.error('Error loading inquiries:', error)
      toast.error(error.message || 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry)
    setEditForm({
      status: inquiry.status,
      paymentStatus: inquiry.paymentStatus,
      totalAmount: inquiry.totalAmount,
      adminNotes: inquiry.adminNotes || "",
    })
  }

  const handleSave = async () => {
    if (!editingInquiry) return

    try {
      const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'
      const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const credentials = btoa(`${username}:${password}`)
      
      const response = await fetch(`/api/admin/inquiries/${editingInquiry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
          ...editForm,
          changedBy: 'Admin',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update Error:', response.status, errorText)
        throw new Error(`Failed to update inquiry: ${response.status}`)
      }

      toast.success('Inquiry updated successfully! Client will see the update instantly.')
      setEditingInquiry(null)
      loadInquiries()
    } catch (error: any) {
      console.error('Error updating inquiry:', error)
      toast.error(error.message || 'Failed to update inquiry')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return

    try {
      const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'
      const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      const credentials = btoa(`${username}:${password}`)
      
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Delete Error:', response.status, errorText)
        throw new Error(`Failed to delete inquiry: ${response.status}`)
      }

      toast.success('Inquiry deleted successfully')
      loadInquiries()
    } catch (error: any) {
      console.error('Error deleting inquiry:', error)
      toast.error(error.message || 'Failed to delete inquiry')
    }
  }

  const InquiryCard = ({ inquiry }: { inquiry: Inquiry }) => {
    const StatusIcon = statusIcons[inquiry.status] || Clock
    const client = inquiry.clientId

    return (
      <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-black mb-2">{inquiry.serviceName}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={statusColors[inquiry.status]}>
                  <StatusIcon className={`h-3 w-3 mr-1 ${inquiry.status === 'in-progress' ? 'animate-spin' : ''}`} />
                  {inquiry.status.toUpperCase().replace('-', ' ')}
                </Badge>
                <Badge variant={inquiry.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                  {inquiry.paymentStatus.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm font-mono text-gray-600">Invoice: {inquiry.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sky-600">{inquiry.totalAmount}</p>
              {inquiry.packageName && (
                <p className="text-xs text-gray-600">{inquiry.packageName}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Client Info */}
          <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              {client?.avatar && (
                <Image
                  src={client.avatar}
                  alt={client.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-black">{client?.name || 'Unknown Client'}</p>
                <p className="text-xs text-gray-600">{client?.email}</p>
              </div>
            </div>
            {client?.phone && <p className="text-xs text-gray-600">📱 {client.phone}</p>}
            {client?.company && <p className="text-xs text-gray-600">🏢 {client.company}</p>}
          </div>

          {/* Message */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
          </div>

          {/* Admin Notes */}
          {inquiry.adminNotes && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs font-semibold text-blue-800 mb-1">Admin Notes:</p>
              <p className="text-xs text-blue-700">{inquiry.adminNotes}</p>
            </div>
          )}

          {/* Dates */}
          <div className="text-xs text-gray-500 mb-4">
            <p>Created: {format(new Date(inquiry.createdAt), 'PPp')}</p>
            <p>Updated: {format(new Date(inquiry.updatedAt), 'PPp')}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Inquiry Details</DialogTitle>
                  <DialogDescription>Complete information and status history</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Message</h4>
                    <p className="text-sm text-gray-700">{inquiry.message}</p>
                  </div>
                  {inquiry.statusHistory && inquiry.statusHistory.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Status History</h4>
                      <div className="space-y-2">
                        {inquiry.statusHistory.map((history, idx) => (
                          <div key={idx} className="text-sm p-2 rounded bg-gray-50">
                            <p className="font-semibold">{history.status.toUpperCase().replace('-', ' ')}</p>
                            <p className="text-xs text-gray-600">
                              by {history.changedBy} on {format(new Date(history.changedAt), 'PPp')}
                            </p>
                            {history.note && <p className="text-xs text-gray-600 mt-1">{history.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(inquiry)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>

            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDelete(inquiry._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Service Inquiries</h1>
          <p className="text-gray-600">Manage client inquiries and invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inquiries</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadInquiries} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </div>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No inquiries found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry._id} inquiry={inquiry} />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingInquiry && (
        <Dialog open={!!editingInquiry} onOpenChange={(open) => !open && setEditingInquiry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Inquiry Status</DialogTitle>
              <DialogDescription>
                Changes will be reflected instantly in the client's dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select
                    value={editForm.paymentStatus}
                    onValueChange={(value) => setEditForm({ ...editForm, paymentStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input
                  value={editForm.totalAmount}
                  onChange={(e) => setEditForm({ ...editForm, totalAmount: e.target.value })}
                  placeholder="e.g., $5000"
                />
              </div>
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                  placeholder="Add notes for the client..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingInquiry(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
