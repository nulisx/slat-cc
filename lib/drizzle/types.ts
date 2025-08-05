import { ExtractTablesWithRelations } from 'drizzle-orm'
import { MySqlTransaction as Transaction } from 'drizzle-orm/mysql-core'
import { MySql2PreparedQueryHKT, MySql2QueryResultHKT } from 'drizzle-orm/mysql2'
import { schema } from '.'
import {
  articles,
  badges,
  biolinks,
  cards,
  categories,
  clicks,
  comments,
  embeds,
  likes,
  links,
  metadata,
  miscellanea,
  oauth2,
  orders,
  passwordResets,
  questions,
  templates,
  tracks,
  users,
  views,
} from './schema'

export type MySqlTransaction = Transaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

export type User = typeof users.$inferSelect
export type Biolink = typeof biolinks.$inferSelect
export type Embed = typeof embeds.$inferSelect
export type Metadata = typeof metadata.$inferSelect
export type Comment = typeof comments.$inferSelect
export type Badge = typeof badges.$inferSelect
export type Link = typeof links.$inferSelect
export type Card = typeof cards.$inferSelect
export type View = typeof views.$inferSelect
export type Track = typeof tracks.$inferSelect
export type Miscellanea = typeof miscellanea.$inferSelect
export type PasswordReset = typeof passwordResets.$inferSelect
export type Oauth2 = typeof oauth2.$inferSelect
export type Like = typeof likes.$inferSelect
export type Click = typeof clicks.$inferSelect
export type Question = typeof questions.$inferSelect
export type Category = typeof categories.$inferSelect
export type Article = typeof articles.$inferSelect
export type Template = typeof templates.$inferSelect
export type Order = typeof orders.$inferSelect
