import 'dotenv/config'

import { drizzle } from 'drizzle-orm/node-postgres'

import { systemConfig } from '@valhalla/core/config'

import * as schema from './schema'

export const db = drizzle(systemConfig.database.url, {
  schema,
})

export * from 'drizzle-orm'
export { schema }
