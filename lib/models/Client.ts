import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IClient {
  _id?: string
  name: string
  email: string
  password: string
  phone?: string
  company?: string
  avatar?: string
  projects: string[] // Array of project IDs
  services: string[] // Array of service IDs (booked)
  refreshToken?: string // Store refresh token
  createdAt?: Date
  updatedAt?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    projects: [
      {
        type: String, // Project IDs
      },
    ],
    services: [
      {
        type: String, // Service IDs
      },
    ],
    refreshToken: {
      type: String,
      select: false, // Don't return refresh token by default
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
ClientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
ClientSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.Client || mongoose.model('Client', ClientSchema)
