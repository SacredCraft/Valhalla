import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { user } from './user'

export const resourceRole = pgTable('resource_role', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

export const resourceRoleResource = pgTable('resource_role_resource', {
  resourceRoleId: text('resourceRoleId')
    .notNull()
    .references(() => resourceRole.id),
  resourceName: text('resourceName').notNull(),
})

export const resourceRoleRelations = relations(resourceRole, ({ many }) => ({
  resources: many(resourceRoleResource),
}))

export const userResourceRole = pgTable('user_resource_role', {
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  resourceRoleId: text('resourceRoleId')
    .notNull()
    .references(() => resourceRole.id),
})
