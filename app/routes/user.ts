import { Router } from 'express'
import { sign } from 'jsonwebtoken'
import { db } from '../client'
import { appConfig } from '../conf'
import { authenticateToken } from '../middleware/auth.middleware'
import { comparePassword, hashPassword } from '../utils/hash'

export const usersRouter = Router()

usersRouter.post('/signin', async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      username: req.body.username,
    },
  })

  if (!user) throw { message: 'User not found' }

  const match = comparePassword(req.body.password, user.password, user.salt)

  if (match) {
    return res.status(200).json({
      message: 'User authenticated',
      token: sign({ id: user.id }, appConfig.SECRET),
      user: {
        ...user,
        password: null,
      },
    })
  }
  return res.status(401).json({ message: 'User not authenticated' })
})

usersRouter.get('/auth', authenticateToken, async (req, res) => {
  const { id } = req.context

  const user = await db.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) throw { message: 'User not found' }

  return res.json({
    message: 'User authenticated',
    user: {
      ...user,
      password: null,
    },
  })
})

usersRouter.post('/register', async (req, res) => {
  const { hash, salt } = hashPassword(req.body.password)

  await db.user.create({
    data: {
      username: req.body.username,
      password: hash,
      salt: salt,
    },
  })

  return res.json({ message: 'User registered' })
})
