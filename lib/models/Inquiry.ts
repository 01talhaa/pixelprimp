import mongoose from 'mongoose'

export interface IInquiry {
  _id?: string
  clientId: string
  serviceId: string
  serviceName: string
  packageName?: string
  packagePrice?: string
  message: string
  status: 'pending' | 'approved' | 'paid' | 'in-progress' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  invoiceNumber: string
  totalAmount: string
  notes?: string
  adminNotes?: string
  createdAt?: Date
  updatedAt?: Date
  statusHistory?: Array<{
    status: string
    changedBy: string
    changedAt: Date
    note?: string
  }>
}

const InquirySchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client ID is required'],
    },
    serviceId: {
      type: String,
      required: [true, 'Service ID is required'],
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
    },
    packageName: {
      type: String,
    },
    packagePrice: {
      type: String,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    adminNotes: {
      type: String,
    },
    statusHistory: [
      {
        status: String,
        changedBy: String,
        changedAt: Date,
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Generate invoice number
InquirySchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.models.Inquiry.countDocuments()
    const invoiceNum = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`
    this.invoiceNumber = invoiceNum
  }
  next()
})

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema)
