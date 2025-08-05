import { SlatServerError } from '@/lib/errors'
import * as z from 'zod'


export function decodeUrl(url: string): string {
  try {
    return decodeURIComponent(url)
  } catch (e) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'Malformed URL encoding',
    })
  }
}

export async function parseRequestBody(req: Request) {
  try {
    return await req.json()
  } catch (e) {
    console.error(e)
    throw new SlatServerError({
      code: 'bad_request',
      message: 'Invalid JSON format in request body. Please ensure the request body is a valid JSON object.',
    })
  }
}

export function parseStrictInt(value: string): number {
  try {
    const intSchema = z.coerce.number().int().positive()

    return intSchema.parse(value)
  } catch (e) {
    console.error(e)
    throw new SlatServerError({
      code: 'bad_request',
      message: 'Invalid integer value. Please ensure the value is a positive integer.',
    })
  }
}
