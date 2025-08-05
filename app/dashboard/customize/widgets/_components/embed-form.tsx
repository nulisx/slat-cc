'use client'

import { Embed } from '@/components/biolink/embeds/embed'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardSection } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { WEBSITE } from '@/lib/config'
import { paths } from '@/lib/constants/paths'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { createEmbed, updateEmbed } from '@/lib/data/embeds/actions'
import { getEmbedOptionByType, getEmbedPlatformByType, type EmbedFeature } from '@/lib/data/embeds/constants'
import type { Embed as BiolinkEmbed, EmbedField } from '@/lib/data/embeds/schemas'
import type { EmbedType } from '@/lib/data/embeds/utils'
import { useServerAction } from '@/lib/hooks/use-server-action'
import { normalizeText } from '@/lib/utils'
import { embedFormSchema, type EmbedFormValues } from '@/lib/zod/schemas/embed'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'

export function EmbedForm({
  data,
  biolink,
  embedType,
}: {
  data?: BiolinkEmbed
  biolink: Biolink
  embedType: EmbedType
}) {
  const router = useRouter()
  const embedOption = React.useMemo(() => getEmbedOptionByType(embedType), [embedType])
  const parentPlatform = React.useMemo(() => getEmbedPlatformByType(embedType), [embedType])

  const form = useForm<EmbedFormValues>({
    resolver: zodResolver(embedFormSchema),
    defaultValues: {
      compactLayout: data?.compactLayout ?? false,
      content: data?.content ?? embedOption.example,
      insideProfileCard: data?.insideProfileCard ?? false,
      secondStyle: data?.secondStyle ?? false,
    },
  })

  React.useEffect(() => {
    if (!data) {
      form.setValue('content', embedOption.example)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedType])

  const { run: create, loading: creating } = useServerAction(createEmbed, {
    toast: {
      success: 'Embed created successfully',
    },
  })

  const { run: update, loading: updating } = useServerAction(updateEmbed, {
    toast: {
      success: 'Embed updated successfully',
    },
  })

  const onSubmit = async (values: EmbedFormValues) => {
    if (data) await update({ id: data.id, values })
    else await create(values)

    router.push(paths.dashboard.customize.widgets)
  }

  const getEmbedFeature = (type: EmbedField): EmbedFeature | undefined => {
    return embedOption.features.find((feature) => feature.feature === type)
  }

  const options = [
    getEmbedFeature('insideProfileCard'),
    getEmbedFeature('compactLayout'),
    getEmbedFeature('secondStyle'),
  ].filter(Boolean) as EmbedFeature[]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="text-foreground flex flex-row items-center gap-3">
          <Icon name={parentPlatform.icon} className="size-6" />
          <h1 className="text-xl font-semibold">
            {data ? 'Edit' : 'Add'} {normalizeText(embedOption.type)}
          </h1>
        </div>
        {embedOption.type === 'discord-presence' ? (
          <Alert variant="info" title="Join Our Discord to Enable Presence">
            You must be a member of our{' '}
            <Link
              href={WEBSITE.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              Discord Server
            </Link>{' '}
            for this widget to work.
          </Alert>
        ) : (
          <Alert variant="tip" title="Did you know?">
            If you&apos;re using the{' '}
            <Link href={`${paths.dashboard.customize.appearance}#layout`} className="text-foreground underline">
              third layout
            </Link>{' '}
            or set a max width of at least 600px, embeds inside the profile card will be displayed in a grid.
          </Alert>
        )}
        <div className="space-y-2">
          <FormLabel>Preview</FormLabel>
          <Embed
            embed={form.watch()}
            card={biolink.card}
            colors={{
              text: biolink.textColor,
              theme: biolink.themeColor,
              name: biolink.nameColor,
            }}
            container={biolink.container}
            preview
          />
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Eg. https://open.spotify.com/track/5vuiHi3QYbwcm1OKJOYnrf?si=af79edb128304092"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Options</FormLabel>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {options.map((option) => (
              <CardSection className="p-4" key={option.label}>
                <FormField
                  control={form.control}
                  name={option.feature}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start justify-between space-y-0 space-x-3">
                      <div className="space-y-1 leading-none">
                        <FormLabel>{option.label}</FormLabel>
                        <FormDescription>{option.description}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardSection>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button disabled={creating || updating} className="w-full">
            {data ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
