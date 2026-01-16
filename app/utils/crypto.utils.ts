import crypto from 'crypto'
import { License } from '../types'

export function decryptCppModules(encryptedBase64: string): License {
  const key = process.env.PRIVATE_KEY_PEM || ''

  try {
    const buffer = Buffer.from(encryptedBase64, 'base64')
    const decrypted = crypto.privateDecrypt(
      {
        key,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer,
    )
    return JSON.parse(decrypted.toString('utf-8'))
  } catch (err: any) {
    throw 'Invalid decryption'
  }
}

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex') // Generate a random salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex') // Hash the password with the salt
  return { salt, hash }
}

export const comparePassword = (password: string, hash: string, salt: string) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === hashVerify
}

export async function hashCppModule(cppModuleString: string) {
  return crypto.createHash('sha256').update(cppModuleString).digest('base64')
}
