import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { user } from './user'

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  impersonatedBy: text('impersonatedBy').references(() => user.id),
})
