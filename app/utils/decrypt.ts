import crypto from 'crypto'
import { License } from '../types'

export function encrypt(data: string): string {
  const publicKey = process.env.PUBLIC_KEY_PEM || ''

  const buffer = Buffer.from(data, 'utf-8')
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer,
  )
  return encrypted.toString('base64')
}

export function decryptTokenPair(encryptedBase64: string): string {
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
    throw new Error(`Decryption failed: ${err.message}`)
  }
}
