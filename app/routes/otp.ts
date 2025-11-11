import { Router } from 'express'
import { authenticator, totp } from 'otplib'
import { db } from '../client'
import { authenticateToken } from '../middleware/auth.middleware'

const otpRouter = Router()

otpRouter.post('/generate', authenticateToken, async (req, res) => {
  const { userId } = req.body
  const licenseKey = await db.license.findFirst({
    where: {
      userId: userId,
    },
  })
  if (!licenseKey) return res.status(404).json({ error: 'License key not found' })

  const otp = totp.generate(authenticator.encode(licenseKey.value))

  res.json({ otp })
})

export default otpRouter
