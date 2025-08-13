import express from 'express'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()
const prisma = new PrismaClient()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import scraped field data
router.post(
  '/import',
  asyncHandler(async (req, res) => {
    // Read step1 and step2 JSON files
    const step1Path = path.join(
      __dirname,
      '../scraped-data/step1_complete.json'
    )
    const step2Path = path.join(
      __dirname,
      '../scraped-data/step2_complete.json'
    )

    const step1Data = JSON.parse(await fs.readFile(step1Path, 'utf8'))
    const step2Data = JSON.parse(await fs.readFile(step2Path, 'utf8'))

    // Clear existing fields
    await prisma.formField.deleteMany()

    // Import step 1 fields
    for (const field of step1Data) {
      await prisma.formField.create({
        data: {
          step: 1,
          elementType: field.elementType,
          fieldType: field.fieldType,
          fieldId: field.id || '',
          fieldName: field.name,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder,
          required: field.required || false,
          maxLength: field.maxLength,
          minLength: field.minLength,
          pattern: field.pattern,
          options: field.options || null
        }
      })
    }

    // Import step 2 fields
    for (const field of step2Data) {
      await prisma.formField.create({
        data: {
          step: 2,
          elementType: field.elementType,
          fieldType: field.fieldType,
          fieldId: field.id || '',
          fieldName: field.name,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder,
          required: field.required || false,
          maxLength: field.maxLength,
          minLength: field.minLength,
          pattern: field.pattern,
          options: field.options || null
        }
      })
    }

    const totalFields = step1Data.length + step2Data.length

    res.json({
      success: true,
      message: `Imported ${totalFields} form fields`,
      step1Count: step1Data.length,
      step2Count: step2Data.length
    })
  })
)

// Get fields for a specific step
router.get(
  '/step/:stepNumber',
  asyncHandler(async (req, res) => {
    const { stepNumber } = req.params

    const fields = await prisma.formField.findMany({
      where: { step: parseInt(stepNumber) },
      orderBy: { label: 'asc' }
    })

    res.json({
      success: true,
      step: parseInt(stepNumber),
      fields
    })
  })
)

export default router
