import { Button } from '@/components/ui/button'
import { InitiateDiscordCallbackArgs } from '@/lib/auth/discord/schemas'
import { Icons } from '@/lib/constants/icons'
import { paths } from '@/lib/constants/paths'
import { useApiRoutes } from '@/lib/hooks/use-api-routes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DiscordRegisterButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter()

  const { actions, loading: registering } = useApiRoutes([
    {
      name: 'registerWithDiscord',
      method: 'POST',
      endpoint: paths.api.auth.discord.callback,
    },
  ] as const)

  async function onRegisterWithDiscord() {
    try {
      const url = await actions.registerWithDiscord<string>({ state: 'register' } satisfies InitiateDiscordCallbackArgs)
      router.push(url)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An unknown error occurred.')
    }
  }

  return (
    <Button
      disabled={disabled || registering}
      variant="secondary-glossy"
      type="button"
      onClick={onRegisterWithDiscord}
      className="w-full from-indigo-500 to-indigo-600"
    >
      <Icons.discord className="h-5 w-5" />
      Sign Up with Discord
    </Button>
  )
}
