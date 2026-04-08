// Health check endpoint for Vercel
export default function handler(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Beauty by Vicky API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
