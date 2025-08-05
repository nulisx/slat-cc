import { z } from 'zod'

import type {
  AssetsField,
  BiolinkField,
  CommentsField,
  EnhancementsField,
  LayoutField,
  ProfileField,
  RevealScreenField,
} from '@/lib/data/biolink/schemas'
import {
  CardContainerField,
  assetsFields,
  biolinkFields,
  cardContainerFields,
  commentsFields,
  enhancementsFields,
  layoutFields,
  profileFields,
  revealScreenFields,
} from '@/lib/data/biolink/schemas'
import {
  CardBorderRadius,
  ContainerBorderWidth,
  Degree,
  LayoutMaxWidth,
  PageTransitionDuration,
  PercentRange,
} from '@/lib/data/enums'
import { LinkField, linkFields } from '@/lib/data/links/schemas'
import { optionalField } from '@/lib/zod/utils'

export const profileFormSchema = z.object({
  name: profileFields.name.max(50),
  bio: profileFields.bio.max(800),
  location: profileFields.location.max(50),
  occupation: profileFields.occupation.max(50),
} satisfies Partial<Record<ProfileField, z.ZodTypeAny>>)

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const colorsFormSchema = z.object({
  textColor: biolinkFields.textColor,
  themeColor: biolinkFields.themeColor,
  nameColor: biolinkFields.nameColor,
} satisfies Partial<Record<BiolinkField, z.ZodTypeAny>>)

export type ColorsFormValues = z.infer<typeof colorsFormSchema>

export const assetsFormSchema = z.object({
  avatar: optionalField(assetsFields.avatar),
  banner: optionalField(assetsFields.banner),
  background: optionalField(assetsFields.background),
  audio: optionalField(assetsFields.audio),
  video: optionalField(assetsFields.video),
  cursor: optionalField(assetsFields.cursor),
  avatarDecoration: optionalField(assetsFields.avatarDecoration),
  avatarDecorationHue: assetsFields.avatarDecorationHue.min(Degree.Min).max(Degree.Max),
  avatarBorderRadius: assetsFields.avatarBorderRadius,
} satisfies Record<AssetsField, z.ZodTypeAny>)

export type AssetsFormValues = z.infer<typeof assetsFormSchema>

export const fontsFormSchema = z.object({
  nameFont: biolinkFields.nameFont,
  textFont: biolinkFields.textFont,
} satisfies Partial<Record<BiolinkField, z.ZodTypeAny>>)

export type FontsFormValues = z.infer<typeof fontsFormSchema>

export const cardFormSchema = z.object({
  backgroundColor: cardContainerFields.backgroundColor,
  backgroundColorSecondary: optionalField(cardContainerFields.backgroundColorSecondary),
  backgroundBlur: cardContainerFields.backgroundBlur.min(PercentRange.Min).max(PercentRange.Max),
  backgroundOpacity: cardContainerFields.backgroundOpacity.min(PercentRange.Min).max(PercentRange.Max),
  borderColor: cardContainerFields.borderColor,
  borderRadius: cardContainerFields.borderRadius.min(CardBorderRadius.Min).max(CardBorderRadius.Max),
  borderOpacity: cardContainerFields.borderOpacity.min(PercentRange.Min).max(PercentRange.Max),
  borderWidth: cardContainerFields.borderWidth,
  gradientAngle: cardContainerFields.gradientAngle,
  shadowColor: cardContainerFields.shadowColor,
  shadowOpacity: cardContainerFields.shadowOpacity.min(PercentRange.Min).max(PercentRange.Max),
  containerBackgroundColor: cardContainerFields.backgroundColor,
  containerBackgroundOpacity: cardContainerFields.backgroundOpacity.min(PercentRange.Min).max(PercentRange.Max),
  containerBorderColor: cardContainerFields.borderColor,
  containerBorderOpacity: cardContainerFields.borderOpacity.min(PercentRange.Min).max(PercentRange.Max),
  containerBorderWidth: cardContainerFields.borderWidth.min(ContainerBorderWidth.Min).max(ContainerBorderWidth.Max),
} satisfies Partial<Record<CardContainerField, z.ZodTypeAny>>)

export type CardFormValues = z.infer<typeof cardFormSchema>

export const layoutFormSchema = z.object({
  alignLeft: layoutFields.alignLeft,
  isBadgesNextToName: layoutFields.isBadgesNextToName,
  avatarPosition: layoutFields.avatarPosition,
  maxWidth: layoutFields.maxWidth.min(LayoutMaxWidth.Min).max(LayoutMaxWidth.Max),
} satisfies Partial<Record<LayoutField, z.ZodTypeAny>>)

export type LayoutFormValues = z.infer<typeof layoutFormSchema>

export const commentsFormSchema = z.object({
  compact: commentsFields.compact,
  enabled: commentsFields.enabled,
  hidden: commentsFields.hidden,
} satisfies Partial<Record<CommentsField, z.ZodTypeAny>>)

export type CommentsFormValues = z.infer<typeof commentsFormSchema>

export const revealScreenFormSchema = z.object({
  text: revealScreenFields.text.min(1).max(50),
  persistent: revealScreenFields.persistent,
} satisfies Partial<Record<RevealScreenField, z.ZodTypeAny>>)

export type RevealScreenFormValues = z.infer<typeof revealScreenFormSchema>

export const enhancementsFormSchema = z.object({
  pageOverlay: optionalField(enhancementsFields.pageOverlay),
  cursorTrail: optionalField(enhancementsFields.cursorTrail),
  visualizeAudio: enhancementsFields.visualizeAudio,
  animateViews: enhancementsFields.animateViews,
  tiltingCard: enhancementsFields.tiltingCard,
  showViews: enhancementsFields.showViews,
  backgroundEffect: optionalField(enhancementsFields.backgroundEffect),
  backgroundEffectHue: enhancementsFields.backgroundEffectHue.min(Degree.Min).max(Degree.Max),
  pageTransitionDuration: enhancementsFields.pageTransitionDuration
    .min(PageTransitionDuration.Min)
    .max(PageTransitionDuration.Max),
  pageTransition: optionalField(enhancementsFields.pageTransition),
  nameEffects: enhancementsFields.nameEffects.max(3),
  bioEffect: optionalField(enhancementsFields.bioEffect),
  iconsGlow: enhancementsFields.iconsGlow,
} satisfies Partial<Record<EnhancementsField, z.ZodTypeAny>>)

export type EnhancementsFormValues = z.infer<typeof enhancementsFormSchema>

export const iconsFormSchema = z.object({
  iconColor: linkFields.iconColor,
  backgroundColor: linkFields.backgroundColor,
} satisfies Partial<Record<LinkField, z.ZodTypeAny>>)

export type IconsFormValues = z.infer<typeof iconsFormSchema>

export const trackLayoutFormSchema = z.object({
  musicPlayer: layoutFields.musicPlayer,
} satisfies Partial<Record<LayoutField, z.ZodTypeAny>>)

export type TrackLayoutFormValues = z.infer<typeof trackLayoutFormSchema>
