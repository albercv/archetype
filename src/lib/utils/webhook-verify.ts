import { createHmac, timingSafeEqual } from 'crypto'

export function verifyLemonSqueezySignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const hmac = createHmac('sha256', secret)
    hmac.update(rawBody)
    const digest = hmac.digest('hex')
    const expected = Buffer.from(digest, 'utf8')
    const received = Buffer.from(signature, 'utf8')
    if (expected.length !== received.length) return false
    return timingSafeEqual(expected, received)
  } catch {
    return false
  }
}
