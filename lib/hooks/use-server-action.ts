import type { ServerActionResponse } from '@/lib/middleware/session'
import { useState } from 'react'
import { toast } from 'sonner'

type ToastOptions = {
  loading?: string
  success?: string
  error?: string
}

async function withToast<T>(promise: Promise<T>, toastOptions: ToastOptions = {}): Promise<T> {
  toast.promise(promise, {
    loading: toastOptions.loading || 'Processing...',
    success: toastOptions.success || 'Successfully processed.',
    error: (err) => {
      if (err instanceof Error) return err.message
      return toastOptions.error || 'Something went wrong.'
    },
  })

  return await promise
}

/**
 * A hook to wrap server actions with loading and toast notifications.
 */
export function useServerAction<TFn extends (...args: any[]) => Promise<ServerActionResponse<any> | void>>(
  action: TFn,
  options?: {
    toast?: ToastOptions
  },
) {
  const [loading, setLoading] = useState(false)

  const run = async (...args: Parameters<TFn>) => {
    setLoading(true)

    const promise = (async () => {
      const res = await action(...args)

      if (res?.error) {
        throw new Error(res.error)
      }

      return res?.data
    })()

    try {
      const result = options?.toast ? await withToast(promise, options.toast) : await promise
      return result
    } catch (error) {
      // swallow error to prevent unhandled promise rejection
      return undefined
    } finally {
      setLoading(false)
    }
  }

  return { run, loading }
}
