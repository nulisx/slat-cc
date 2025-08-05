'use client'

import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { CardFormWrapper } from '@/components/form/card-form-wrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/lib/constants/icons'
import { updateProfile } from '@/lib/data/biolink/actions/update-profile'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { useServerAction } from '@/lib/hooks/use-server-action'
import { useSyncPreview } from '@/lib/hooks/use-sync-preview'
import { profileFormSchema, type ProfileFormValues } from '@/lib/zod/schemas/biolink'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LuUserRoundPen } from 'react-icons/lu'

export function ProfileForm({ biolink, premium }: { biolink: Biolink; premium: boolean }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...biolink.profile,
    },
  })

  const { run, loading } = useServerAction(updateProfile, {
    toast: {
      success: 'Profile updated successfully',
    },
  })

  const onSubmit = async (values: ProfileFormValues) => {
    await run(values)
  }

  useSyncPreview(form, (values, prev) => ({ profile: { ...prev.profile, ...values } }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardFormWrapper loading={loading} title="Profile" icon={LuUserRoundPen}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input icon={Icons.user} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <TiptapEditor
                    themeColor={biolink.themeColor}
                    value={field.value}
                    onChange={field.onChange}
                    premium={premium}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input {...field} icon={Icons.briefcase} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} icon={Icons.location} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardFormWrapper>
      </form>
    </Form>
  )
}
