import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import { errorHandler } from './middleware/errorHandler.js'
import udyamRoutes from './routes/udyam.js'
import fieldRoutes from './routes/fields.js'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/udyam', udyamRoutes)
app.use('/api/fields', fieldRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Graceful shutdown
// process.on('SIGINT', async () => {
//   await prisma.$disconnect()
//   process.exit(0)
// })

app.listen(PORT, () => {
  console.log(`🚀 Udyam API Server running on port ${PORT}`)
})
