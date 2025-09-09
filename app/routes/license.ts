import { Router } from 'express'
import { z } from 'zod'
import { db } from '../client'
import { authenticateToken } from '../middleware/auth.middleware'
import { decryptCppModules, decryptTokenPair, encrypt } from '../utils/decrypt'

console.log(encrypt('test'))

const licenseValidationSchema = z.object({
  midi: z.array(
    z.object({
      encrypted: z.string(),
    }),
  ),
  pairToken: z.string().min(10),
})

export const licenseRouter = Router()

licenseRouter.post('/validate', authenticateToken, async (req, res) => {
  console.log('License validation request received')
  try {
    const validationResult = licenseValidationSchema.parse(req.body)

    const userId = req.context?.id
    if (!userId) {
      return res.status(401).json({ error: 'User context missing' })
    }

    const licenseInput = validationResult.midi
    const pairToken = validationResult.pairToken

    const decryptedModules = licenseInput.map(({ encrypted }) => decryptCppModules(encrypted))
    const serializedLicense = Buffer.from(JSON.stringify(decryptedModules)).toString('base64')

    const existingLicense = await db.license.findUnique({ where: { userId } })

    if (!existingLicense) {
      await db.license.create({
        data: {
          userId,
          name: 'License',
          value: serializedLicense,
          expiredAt: new Date(),
        },
      })
      return res.status(201).json({ message: 'License created successfully' })
    }

    if (existingLicense.value !== serializedLicense) {
      return res.status(409).json({ message: 'License already exists with different value' })
    }

    console.log('License validated successfully')
    return res
      .status(200)
      .json({ message: 'License validated successfully', pairToken: decryptTokenPair(pairToken) })
  } catch (error) {
    console.error('License validation failed:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})
