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

export const resourceRoleResourceRelations = relations(
  resourceRoleResource,
  ({ one }) => ({
    resourceRole: one(resourceRole, {
      fields: [resourceRoleResource.resourceRoleId],
      references: [resourceRole.id],
    }),
  })
)

export const resourceRoleRelations = relations(resourceRole, ({ many }) => ({
  resources: many(resourceRoleResource),
  users: many(userResourceRole),
}))

export const userResourceRole = pgTable('user_resource_role', {
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  resourceRoleId: text('resourceRoleId')
    .notNull()
    .references(() => resourceRole.id),
})

export const userResourceRoleRelations = relations(
  userResourceRole,
  ({ one }) => ({
    user: one(user, {
      fields: [userResourceRole.userId],
      references: [user.id],
    }),
    resourceRole: one(resourceRole, {
      fields: [userResourceRole.resourceRoleId],
      references: [resourceRole.id],
    }),
  })
)
