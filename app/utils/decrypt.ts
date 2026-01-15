import crypto from 'crypto'
import { License } from '../types'

export function decryptTokenPair(encryptedBase64: string): string {
  const key = process.env.PRIVATE_KEY_PEM || ''
  console.log('Using private key:', key)
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
    return decrypted.toString('utf-8')
  } catch (err: any) {
    throw new Error(`Decryption failed: ${err.message}`)
  }
}

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

export async function hashString(encryptedBase64: string) {
  return crypto.createHash('sha256').update(encryptedBase64).digest('base64')
}
