import { Router } from 'express'
import { prisma } from '../client'
import { authenticateToken } from '../middleware/auth.middleware'
import { decryptCppModules, hashCppModule } from '../utils/crypto.utils'

export const seatsRouter = Router()

seatsRouter.post('/register', authenticateToken, async (req, res) => {
  const { modules } = req.body
  const { id } = req.context

  const decreptedModules = modules.map((m: any) => {
    const val = m.encrypted.split('==')[0]
    return decryptCppModules(val)
  })

  const hashed = await Promise.all(
    decreptedModules.map((mod: string) => {
      return hashCppModule(JSON.stringify(mod))
    }),
  )

  const existingLicense = await prisma.license.findFirst({
    where: {
      userId: id,
    },
  })

  if (existingLicense) {
    return res.status(400).json({ error: 'Seat already registered' })
  }

  await prisma.license.create({
    data: {
      userId: id,
      value: JSON.stringify(hashed),
      name: 'default',
      expiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  })

  res.json({
    message: 'Seat registered successfully',
  })
})
