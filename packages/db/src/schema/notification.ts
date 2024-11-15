import { relations, type InferSelectModel } from 'drizzle-orm'
import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { user } from './user'

export const notification = pgTable('notification', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  data: jsonb('data').notNull(),
  readAt: timestamp('readAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  recipientId: text('recipientId').references(() => user.id),
})

export const notificationRecipients = pgTable('notification_recipients', {
  notificationId: text('notificationId')
    .notNull()
    .references(() => notification.id),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
})

export const notificationRelations = relations(
  notification,
  ({ one, many }) => ({
    recipient: one(user, {
      fields: [notification.recipientId],
      references: [user.id],
    }),
    recipients: many(notificationRecipients),
  })
)

export const notificationRecipientsRelations = relations(
  notificationRecipients,
  ({ one }) => ({
    notification: one(notification, {
      fields: [notificationRecipients.notificationId],
      references: [notification.id],
    }),
    user: one(user, {
      fields: [notificationRecipients.userId],
      references: [user.id],
    }),
  })
)

export type NotificationWithUser = InferSelectModel<typeof notification> & {
  recipient: InferSelectModel<typeof user>
}
