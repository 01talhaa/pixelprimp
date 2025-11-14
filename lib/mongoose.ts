import mongoose from 'mongoose'

if (!process.env.MONGO_URI) {
  throw new Error('Please add your Mongo URI to .env file')
}

const MONGO_URI: string = process.env.MONGO_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    console.log('Creating new MongoDB connection to:', MONGO_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'))
    cached.promise = mongoose.connect(MONGO_URI, opts)
  }

  try {
    cached.conn = await cached.promise
    console.log('MongoDB connected successfully')
  } catch (e) {
    console.error('MongoDB connection error:', e)
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
