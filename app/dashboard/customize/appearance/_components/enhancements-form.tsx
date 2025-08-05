'use client'

import { Bio } from '@/components/biolink/bio'
import { DisplayName } from '@/components/biolink/display-name'
import { CardFormWrapper } from '@/components/form/card-form-wrapper'
import { OptionsPicker } from '@/components/form/options-picker'
import { ReferenceSlider } from '@/components/form/reference-slider'
import { TextEffectPicker } from '@/components/form/text-effect-picker'
import { ToggableCard } from '@/components/form/toggable-card'
import { ResponsiveModal } from '@/components/responsive-modal'
import { CardSection } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Icons, IconType } from '@/lib/constants/icons'
import { updateEnhancements } from '@/lib/data/biolink/actions/update-enhancements'
import {
  backgroundEffectOptions,
  cursorTrailOptions,
  fontSchema,
  pageOverlayOptions,
  pageTransitionOptions,
  TextEffect,
} from '@/lib/data/biolink/constants'
import type { Biolink, EnhancementsField } from '@/lib/data/biolink/schemas'
import { PageTransitionDuration } from '@/lib/data/enums'
import { useServerAction } from '@/lib/hooks/use-server-action'
import { useSyncPreview } from '@/lib/hooks/use-sync-preview'
import { cn, normalizeText } from '@/lib/utils'
import { enhancementsFormSchema, type EnhancementsFormValues } from '@/lib/zod/schemas/biolink'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { HiOutlineLightBulb } from 'react-icons/hi'

type EnhancementOption = { name: EnhancementsField; label: string; icon: IconType; premium?: boolean }

export function EnhancementsForm({ biolink, premium }: { biolink: Biolink; premium: boolean }) {
  const [pageOverlayDialogOpen, setPageOverlayDialogOpen] = React.useState(false)
  const [cursorTrailDialogOpen, setCursorTrailDialogOpen] = React.useState(false)
  const [backgroundEffectDialogOpen, setBackgroundEffectDialogOpen] = React.useState(false)
  const [pageTransitionDialogOpen, setPageTransitionDialogOpen] = React.useState(false)

  const form = useForm<EnhancementsFormValues>({
    resolver: zodResolver(enhancementsFormSchema),
    defaultValues: {
      animateViews: biolink.enhancements.animateViews,
      tiltingCard: biolink.enhancements.tiltingCard,
      iconsGlow: biolink.enhancements.iconsGlow,
      showViews: biolink.enhancements.showViews,
      visualizeAudio: biolink.enhancements.visualizeAudio,
      pageOverlay: biolink.enhancements.pageOverlay ?? '',
      cursorTrail: biolink.enhancements.cursorTrail ?? '',
      nameEffects: biolink.enhancements.nameEffects ?? [],
      bioEffect: biolink.enhancements.bioEffect ?? '',
      backgroundEffect: biolink.enhancements.backgroundEffect ?? '',
      backgroundEffectHue: biolink.enhancements.backgroundEffectHue,
      pageTransition: biolink.enhancements.pageTransition ?? '',
      pageTransitionDuration: biolink.enhancements.pageTransitionDuration,
    },
  })

  const { run, loading } = useServerAction(updateEnhancements, {
    toast: {
      success: 'Enhancements updated successfully',
    },
  })

  const onSubmit = async (values: EnhancementsFormValues) => {
    await run(values)
  }

  useSyncPreview(form, (values, prev) => ({
    // @ts-expect-error enhancements is a subset of biolink
    enhancements: { ...prev.enhancements, ...values },
    card: { ...prev.card, tilt: values.tiltingCard },
  }))

  const modalFields = [
    {
      name: 'pageOverlay',
      label: 'Page Overlay',
      icon: Icons.layers,
      options: pageOverlayOptions,
      open: pageOverlayDialogOpen,
      setOpen: setPageOverlayDialogOpen,
    },
    {
      name: 'cursorTrail',
      label: 'Cursor Trail',
      icon: Icons.cursor,
      options: cursorTrailOptions,
      open: cursorTrailDialogOpen,
      setOpen: setCursorTrailDialogOpen,
      premium: true,
    },
    {
      name: 'backgroundEffect',
      label: 'Background Effect',
      icon: Icons.fallingStar,
      options: backgroundEffectOptions,
      open: backgroundEffectDialogOpen,
      setOpen: setBackgroundEffectDialogOpen,
      premium: true,
      extra: (
        <FormField
          control={form.control}
          name="backgroundEffectHue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Effect Hue</FormLabel>
              <FormControl>
                <ReferenceSlider
                  step={5}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!premium}
                  unit="deg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      name: 'pageTransition',
      label: 'Page Transition',
      icon: Icons.sparkles,
      options: pageTransitionOptions,
      open: pageTransitionDialogOpen,
      setOpen: setPageTransitionDialogOpen,
      premium: true,
      extra: (
        <FormField
          control={form.control}
          name="pageTransitionDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Transition Duration</FormLabel>
              <FormControl>
                <ReferenceSlider
                  min={PageTransitionDuration.Min}
                  max={PageTransitionDuration.Max}
                  step={0.1}
                  value={field.value}
                  onValueChange={field.onChange}
                  unit="s"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
  ] satisfies Array<EnhancementOption & Record<string, unknown>>

  const toggableFields = [
    { name: 'animateViews', label: 'Animate Views', icon: Icons.eye },
    { name: 'tiltingCard', label: 'Tilting Card', icon: Icons.rotate },
    { name: 'iconsGlow', label: 'Glowing Icons', icon: HiOutlineLightBulb },
    { name: 'showViews', label: 'Show Views', icon: Icons.eye },
    { name: 'visualizeAudio', label: 'Audio Visualizer', icon: Icons.music, premium: true },
  ] satisfies Array<EnhancementOption>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardFormWrapper loading={loading} title="Enhancements" icon={Icons.sparkles}>
          <FormField
            control={form.control}
            name="nameEffects"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextEffectPicker value={field.value} onChange={field.onChange} premium={premium} multiple>
                    <DisplayName
                      title="Name Effect"
                      options={{ effects: field.value, color: '#FFFFFF', font: fontSchema.enum.inter }}
                      className="text-base!"
                    />
                  </TextEffectPicker>
                </FormControl>
                <FormDescription>
                  Select up to 3 effects to apply to your display name. Note some effects may not be compatible
                  together.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bioEffect"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextEffectPicker
                    value={field.value ? [field.value] : []}
                    onChange={(v) => field.onChange(v[0] ?? '')}
                    premium={premium}
                  >
                    <Bio
                      text="This is a sample bio text to preview the effect."
                      options={{
                        bioEffect: field.value as TextEffect,
                        color: '#d4d4d4',
                        alignLeft: true,
                      }}
                      className="text-base"
                    />
                  </TextEffectPicker>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div className="flex flex-wrap gap-4">
            {modalFields.map((field) => {
              const isDisabled = field.premium && !premium

              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as EnhancementsField}
                  render={({ field: f }) => (
                    <FormItem className="w-fit">
                      <FormControl>
                        <ResponsiveModal
                          icon={field.icon}
                          open={field.open}
                          setOpen={field.setOpen}
                          title={field.label}
                          trigger={
                            <EffectFeatureCard
                              icon={field.icon}
                              value={f.value as string} // only subset values of string are used
                              label={field.label}
                              onClick={() => field.setOpen(true)}
                              disabled={isDisabled}
                            />
                          }
                        >
                          <div className="space-y-3">
                            <OptionsPicker
                              placeholder={`Select ${field.label.toLowerCase()}`}
                              value={f.value}
                              onChange={f.onChange}
                              modal
                              premium={premium}
                              disabled={isDisabled}
                              items={field.options}
                              optional
                            />
                            {field.extra}
                          </div>
                        </ResponsiveModal>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            })}
          </div>
          <div className="flex flex-wrap gap-4">
            {toggableFields.map((toggableField) => (
              <FormField
                key={toggableField.name}
                control={form.control}
                name={toggableField.name}
                render={({ field }) => {
                  const disabled = toggableField.premium && !premium
                  const icon = disabled ? Icons.gem : toggableField.icon

                  return (
                    <ToggableCard
                      icon={icon}
                      label={toggableField.label}
                      disabled={disabled}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )
                }}
              />
            ))}
          </div>
        </CardFormWrapper>
      </form>
    </Form>
  )
}

function EffectFeatureCard({
  icon,
  value,
  label,
  onClick,
  disabled, // if undefined, it is a free feature
}: {
  icon: IconType
  value: string
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  const isActive = Boolean(value)
  const IconComponent = disabled ? Icons.gem : icon

  const iconClasses = cn('size-6 text-muted-foreground', isActive && 'text-primary', disabled && 'text-primary/50')
  const titleClasses = cn('text-sm font-medium', isActive ? 'text-primary' : 'text-foreground')
  const subtitleClasses = cn('text-xs', isActive ? 'text-foreground' : 'text-muted-foreground')

  return (
    <CardSection
      className={cn(
        'flex w-fit items-center gap-3 rounded-[1.2rem] py-3 pr-6 pl-4 transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'cursor-pointer',
        !disabled && isActive && 'bg-primary/10 border-primary/15 hover:bg-primary/15',
        !disabled && !isActive && 'hover:bg-foreground/5',
      )}
      onClick={onClick}
    >
      <div className="text-foreground/70">
        <IconComponent className={iconClasses} />
      </div>
      <div className="flex flex-col">
        <span className={titleClasses}>{disabled ? 'Premium Feature' : isActive ? normalizeText(value) : 'None'}</span>
        <span className={subtitleClasses}>{label}</span>
      </div>
    </CardSection>
  )
}
