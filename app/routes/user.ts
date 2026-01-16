import { Router } from 'express'
import { sign } from 'jsonwebtoken'
import { prisma } from '../client'
import { appConfig } from '../conf'
import { userScheme, userSignInScheme } from '../scheme/user.scheme'
import { comparePassword, hashPassword } from '../utils/crypto.utils'

export const usersRouter = Router()

usersRouter.post('/signin', async (req, res) => {
  const { username, password } = userSignInScheme.parse(req.body)

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if (!user) throw { message: 'User not found' }

  const match = comparePassword(password, user.password, user.salt)

  if (match) {
    const response = {
      message: 'User authenticated',
      token: sign({ id: user.id }, appConfig.SECRET),
      user: {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        id: user.id,
      },
    }

    return res.status(200).json(response)
  }
  return res.status(401).json({ message: 'User not authenticated' })
})

usersRouter.post('/register', async (req, res) => {
  const { username, firstname, lastname, password } = userScheme.parse(req.body)
  const { hash, salt } = hashPassword(password)

  await prisma.user.create({
    data: {
      username,
      firstname,
      lastname,
      password: hash,
      salt: salt,
    },
  })

  return res.json({ message: 'User registered' })
})
