// routes/udyam.js
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { step1Schema, step2Schema } from '../utils/validation.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()
const prisma = new PrismaClient()

// Submit Step 1 data
router.post(
  '/step1',
  asyncHandler(async (req, res) => {
    const { error, value } = step1Schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path[0],
          message: d.message
        }))
      })
    }

    const submission = await prisma.udyamSubmission.create({
      data: {
        aadhaarNumber: value.aadhaarNumber,
        entrepreneurName: value.entrepreneurName,
        aadhaarConsent: value.aadhaarConsent,
        otpCode: value.otpCode,
        aadhaarVerified: true, // In real app, verify OTP first
        currentStep: 2,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        submissionData: value
      }
    })

    res.status(201).json({
      success: true,
      submissionId: submission.id,
      message: 'Step 1 completed successfully',
      nextStep: 2
    })
  })
)

// Submit Step 2 data
router.post(
  '/step2/:submissionId',
  asyncHandler(async (req, res) => {
    const { submissionId } = req.params
    const { error, value } = step2Schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path[0],
          message: d.message
        }))
      })
    }

    const submission = await prisma.udyamSubmission.findUnique({
      where: { id: submissionId }
    })

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    if (submission.currentStep < 2) {
      return res.status(400).json({ error: 'Complete Step 1 first' })
    }

    const updatedSubmission = await prisma.udyamSubmission.update({
      where: { id: submissionId },
      data: {
        organizationType: value.organizationType,
        panNumber: value.panNumber,
        panHolderName: value.panHolderName,
        dobOrDoi: value.dobOrDoi,
        panConsent: value.panConsent,
        panVerified: true, // In real app, verify PAN first
        currentStep: 3,
        isCompleted: true,
        submissionData: {
          ...submission.submissionData,
          ...value
        }
      }
    })

    res.json({
      success: true,
      submissionId: updatedSubmission.id,
      message: 'Step 2 completed successfully',
      isCompleted: true
    })
  })
)

// Get submission status
router.get(
  '/status/:submissionId',
  asyncHandler(async (req, res) => {
    const { submissionId } = req.params

    const submission = await prisma.udyamSubmission.findUnique({
      where: { id: submissionId },
      select: {
        id: true,
        currentStep: true,
        isCompleted: true,
        aadhaarVerified: true,
        panVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    res.json({
      success: true,
      submission
    })
  })
)

// Get all submissions (admin route)
router.get(
  '/submissions',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (status === 'completed') where.isCompleted = true
    if (status === 'pending') where.isCompleted = false

    const [submissions, total] = await Promise.all([
      prisma.udyamSubmission.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          entrepreneurName: true,
          organizationType: true,
          currentStep: true,
          isCompleted: true,
          aadhaarVerified: true,
          panVerified: true,
          createdAt: true
        }
      }),
      prisma.udyamSubmission.count({ where })
    ])

    res.json({
      success: true,
      submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  })
)

export default router
