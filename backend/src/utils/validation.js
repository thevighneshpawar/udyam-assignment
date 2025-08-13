import Joi from 'joi'

// Step 1 validation schema
export const step1Schema = Joi.object({
  aadhaarNumber: Joi.string()
    .length(12)
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
      'string.length': 'Aadhaar number must be exactly 12 digits',
      'string.pattern.base': 'Aadhaar number must contain only digits'
    }),

  entrepreneurName: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'string.pattern.base': 'Name can only contain letters and spaces'
    }),

  aadhaarConsent: Joi.boolean().valid(true).required().messages({
    'any.only': 'Aadhaar consent is required'
  }),

  otpCode: Joi.string()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only digits'
    })
})

// Step 2 validation schema
export const step2Schema = Joi.object({
  organizationType: Joi.string()
    .valid('1', '2', '3', '4', '5', '6', '7', '9', '10', '11', '8')
    .required()
    .messages({
      'any.only': 'Please select a valid organization type'
    }),

  panNumber: Joi.string()
    .length(10)
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .uppercase()
    .required()
    .messages({
      'string.length': 'PAN must be exactly 10 characters',
      'string.pattern.base': 'PAN format should be AAAAA9999A'
    }),

  panHolderName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'PAN holder name must be at least 2 characters',
    'string.max': 'PAN holder name cannot exceed 100 characters'
  }),

  dobOrDoi: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/)
    .required()
    .messages({
      'string.pattern.base': 'Date must be in DD/MM/YYYY format'
    }),

  panConsent: Joi.boolean().valid(true).required().messages({
    'any.only': 'PAN consent is required'
  })
})
