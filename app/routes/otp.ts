import { Router } from 'express'
import { authenticator, totp } from 'otplib'
import { prisma } from '../client'
import { authenticateToken } from '../middleware/auth.middleware'
import { decryptCppModules, hashCppModule } from '../utils/crypto.utils'

const otpRouter = Router()

otpRouter.post('/generate', authenticateToken, async (req, res) => {
  const { data } = req.body
  const { id } = req.context

  const decreptedModule = decryptCppModules(data)

  const hashed = await hashCppModule(JSON.stringify(decreptedModule))

  const seat = await prisma.license.findFirst({
    where: {
      userId: id,
    },
  })

  if (!seat) throw new Error('No license found for user 320.')

  const seatHashes = JSON.parse(seat.value)

  if (!seatHashes.includes(hashed)) {
    throw new Error('No license found for user 420.')
  }

  totp.options = {
    step: 120,
  }

  const otp = totp.generate(authenticator.encode(JSON.stringify(seat.value)))

  res.json({ otp, expiresIn: totp.timeRemaining() })
})

export default otpRouter
