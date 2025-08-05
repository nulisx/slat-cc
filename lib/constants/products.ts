import { BadgeId } from '@/lib/data/badges/schemas'

export type Product = {
  name: string
  productId: BadgeId
  description: string
  icon: string
  price: number
}

export const products = {
  premium: {
    name: 'Premium',
    productId: BadgeId.Premium,
    description: 'Perm access to premium features.',
    icon: 'noto:gem-stone',
    price: 750_000,
  },
  customBadge: {
    name: 'Custom Badge',
    productId: BadgeId.CustomBadge,
    description: 'Create a custom badge for your profile.',
    icon: 'noto:label',
    price: 1_000_000,
  },
} as const satisfies Record<string, Product>
