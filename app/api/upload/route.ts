import { withUser } from '@/lib/api/middleware/user'
import { SlatServerError } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { ofetch } from 'ofetch'

type XoaApiResponse = {
  data: {
    cdn_url: string
    key: string
  }
}

const sanitizeFileName = (name: string) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_.-]/g, '')

/** POST /api/upload - Upload a file to Xoa */
export const POST = withUser(async ({ req }) => {
  const formData = await req.formData()

  const file = formData.get('file')

  if (!file || !(file instanceof Blob)) {
    throw new SlatServerError({
      code: 'bad_request',
      message: 'No file found in request',
    })
  }

  const uploadFormData = new FormData()
  uploadFormData.append('file', file, 'file')
  uploadFormData.append('original_name', sanitizeFileName(file.name))

  const {
    data: { cdn_url: url },
  } = await ofetch<XoaApiResponse>('https://api.xoa.me/v1/upload', {
    method: 'POST',
    headers: {
      Authorization: process.env.XOA_API_KEY!,
    },
    body: uploadFormData,
    onResponseError({ response }) {
      throw new Error(response._data?.message || 'Xoa API error')
    },
  })

  if (!url) {
    throw new SlatServerError({
      code: 'internal_server_error',
      message: 'Failed to upload file',
    })
  }

  return NextResponse.json(url)
})
