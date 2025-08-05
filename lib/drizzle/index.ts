export * as schema from './schema'
export type * from './types'
import '@/lib/zod/env'

import { isDevelopment } from '@/lib/utils'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'
import * as schema from './schema'

const connection = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 100,
  connectTimeout: isDevelopment() ? 1_000_000_000 : undefined,
})

export const db = drizzle(connection, {
  mode: 'default',
  schema,
})
