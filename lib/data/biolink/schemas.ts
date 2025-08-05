import {
  avatarDecorationSchema,
  avatarPositionSchema,
  backgroundEffectSchema,
  cursorTrailSchema,
  fontSchema,
  musicPlayerLayoutSchema,
  pageOverlaySchema,
  pageTransitionSchema,
  textEffectSchema,
} from '@/lib/data/biolink/constants'
import { colorSchema, urlSchema, usernameSchema } from '@/lib/data/schemas'
import * as z from 'zod'

export const profileFields = {
  name: z.string(),
  bio: z.string(),
  location: z.string(),
  occupation: z.string(),
}

export type ProfileField = keyof z.infer<typeof profileSchema>

export const profileSchema = z.object(profileFields)

export const assetsFields = {
  banner: urlSchema,
  avatar: urlSchema,
  background: urlSchema,
  audio: urlSchema,
  video: urlSchema,
  cursor: urlSchema,
  avatarDecoration: avatarDecorationSchema,
  avatarDecorationHue: z.number(),
  avatarBorderRadius: z.number(),
}

export type AssetsField = keyof z.infer<typeof assetsSchema>

export const assetsSchema = z.object({
  ...assetsFields,
  avatarDecoration: assetsFields.avatarDecoration.optional(),
})

export const commentsFields = {
  enabled: z.boolean(),
  hidden: z.boolean(),
  compact: z.boolean(),
}

export type CommentsField = keyof z.infer<typeof commentsSchema>

export const commentsSchema = z.object(commentsFields)

export const revealScreenFields = {
  text: z.string(),
  persistent: z.boolean(),
}

export type RevealScreenField = keyof z.infer<typeof revealScreenSchema>

export const revealScreenSchema = z.object(revealScreenFields)

export const layoutFields = {
  musicPlayer: musicPlayerLayoutSchema,
  alignLeft: z.boolean(),
  isBadgesNextToName: z.boolean(),
  avatarPosition: avatarPositionSchema,
  maxWidth: z.number(),
}

export type LayoutField = keyof z.infer<typeof layoutSchema>

export const layoutSchema = z.object(layoutFields)

export const enhancementsFields = {
  backgroundEffect: backgroundEffectSchema,
  backgroundEffectHue: z.number(),
  bioEffect: textEffectSchema,
  nameEffects: z.array(textEffectSchema),
  pageTransition: pageTransitionSchema,
  pageTransitionDuration: z.number(),
  pageOverlay: pageOverlaySchema,
  cursorTrail: cursorTrailSchema,
  visualizeAudio: z.boolean(),
  animateViews: z.boolean(),
  showViews: z.boolean(),
  iconsGlow: z.boolean(),
  tiltingCard: z.boolean(),
}

export const enhancementsSchema = z.object({
  ...enhancementsFields,
  backgroundEffect: enhancementsFields.backgroundEffect.optional(),
  pageOverlay: enhancementsFields.pageOverlay.optional(),
  bioEffect: enhancementsFields.bioEffect.optional(),
  cursorTrail: enhancementsFields.cursorTrail.optional(),
  pageTransition: enhancementsFields.pageTransition.optional(),
})

export type EnhancementsField = keyof z.infer<typeof enhancementsSchema>

export const cardContainerFields = {
  backgroundColor: colorSchema,
  backgroundColorSecondary: colorSchema,
  backgroundBlur: z.number(),
  backgroundOpacity: z.number(),
  borderColor: colorSchema,
  borderRadius: z.number(),
  borderOpacity: z.number(),
  borderWidth: z.number(),
  gradientAngle: z.number(),
  shadowColor: colorSchema,
  shadowOpacity: z.number(),
  containerBackgroundColor: colorSchema,
  containerBackgroundOpacity: z.number(),
  containerBorderColor: colorSchema,
  containerBorderOpacity: z.number(),
  containerBorderWidth: z.number(),
  tilt: z.boolean().optional(),
}

export type CardContainerField = keyof typeof cardContainerFields

export const cardSchema = z.object({
  backgroundColor: cardContainerFields.backgroundColor,
  backgroundColorSecondary: cardContainerFields.backgroundColorSecondary, // acts as a gradient color
  backgroundBlur: cardContainerFields.backgroundBlur,
  backgroundOpacity: cardContainerFields.backgroundOpacity,
  borderColor: cardContainerFields.borderColor,
  borderRadius: cardContainerFields.borderRadius,
  borderOpacity: cardContainerFields.borderOpacity,
  borderWidth: cardContainerFields.borderWidth,
  gradientAngle: cardContainerFields.gradientAngle,
  shadowColor: cardContainerFields.shadowColor,
  shadowOpacity: cardContainerFields.shadowOpacity,
  tilt: cardContainerFields.tilt,
})

export type CardField = keyof z.infer<typeof cardSchema>

export const containerSchema = z.object({
  backgroundColor: cardContainerFields.backgroundColor,
  backgroundOpacity: cardContainerFields.backgroundOpacity,
  borderColor: cardContainerFields.borderColor,
  borderOpacity: cardContainerFields.borderOpacity,
  borderWidth: cardContainerFields.borderWidth,
})

export type ContainerField = keyof z.infer<typeof containerSchema>

export const biolinkFields = {
  id: z.number(),
  userId: z.number(),
  username: usernameSchema,
  themeColor: colorSchema,
  nameColor: colorSchema,
  textColor: colorSchema,
  nameFont: fontSchema,
  textFont: fontSchema,
  profile: profileSchema,
  assets: assetsSchema,
  container: containerSchema,
  card: cardSchema,
  layout: layoutSchema,
  comments: commentsSchema,
  enhancements: enhancementsSchema,
  revealScreen: revealScreenSchema,
}

export type BiolinkField = keyof z.infer<typeof biolinkSchema>

export const biolinkSchema = z.object(biolinkFields)

export type Biolink = z.infer<typeof biolinkSchema>
