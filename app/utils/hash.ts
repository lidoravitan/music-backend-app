import crypto from 'crypto'

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex') // Generate a random salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex') // Hash the password with the salt
  return { salt, hash }
}

// Helper function to verify passwords
export const comparePassword = (password: string, hash: string, salt: string) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === hashVerify
}
