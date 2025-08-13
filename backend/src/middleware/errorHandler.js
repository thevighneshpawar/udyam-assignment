export const errorHandler = (err, req, res, next) => {
  // Prisma database errors
  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002':
        return res.status(400).json({
          error: 'Duplicate entry',
          field: err.meta?.target
        })
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found'
        })
      default:
        console.log(err)

        return res.status(500).json({
          error: 'Database error'
        })
    }
  }

  // Validation errors (Joi)
  if (err.name === 'ValidationError' || err.isJoi) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details?.map(d => ({
        field: d.path[0],
        message: d.message
      }))
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    })
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500
  const message = statusCode === 500 ? 'Internal server error' : err.message

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

// Simple async wrapper
export const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
