import { lemonSqueezySetup, createCheckout as lsCreateCheckout } from '@lemonsqueezy/lemonsqueezy.js'

function setup() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  if (!apiKey) throw new Error('LEMONSQUEEZY_API_KEY not set')
  lemonSqueezySetup({ apiKey })
}

export async function createCheckout(sessionId: string): Promise<string> {
  setup()

  const storeId = Number(process.env.LEMONSQUEEZY_STORE_ID)
  const variantId = Number(process.env.LEMONSQUEEZY_VARIANT_ID)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (!storeId || !variantId) throw new Error('LEMONSQUEEZY_STORE_ID or LEMONSQUEEZY_VARIANT_ID not set')

  const response = await lsCreateCheckout(storeId, variantId, {
    checkoutData: {
      custom: { session_id: sessionId },
    },
    productOptions: {
      redirectUrl: `${appUrl}/report/${sessionId}`,
    },
  })

  if (response.error) {
    throw new Error(`LemonSqueezy checkout error: ${JSON.stringify(response.error)}`)
  }

  const url = response.data?.data.attributes.url
  if (!url) throw new Error('No checkout URL in LemonSqueezy response')

  return url
}
