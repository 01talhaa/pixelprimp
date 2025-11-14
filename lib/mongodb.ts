import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGO_URI) {
  throw new Error('Please add your Mongo URI to .env file')
}

const uri: string = process.env.MONGO_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across module reloads
  if (!global._mongoClientPromise) {
    console.log('Creating new MongoDB client (development)')
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  console.log('Creating new MongoDB client (production)')
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch(err => {
    console.error('MongoDB client connection error:', err)
    throw err
  })
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    console.log('Connecting to MongoDB...')
    const client = await clientPromise
    const db = client.db('pixelprimp')
    console.log('Connected to database: pixelprimp')
    return { client, db }
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw error
  }
}

export default clientPromise
