'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { notification as notificationSchema } from '@valhalla/db/schema'
import { badgeVariants } from '@valhalla/ui/badge'
import { cn } from '@valhalla/ui/cn'

import { api } from '@/lib/trpc/react'

const ValUserNotifications = () => {
  const { data: notifications } = api.notifications.list.useQuery(undefined, {
    refetchInterval: 20000,
  })
  const utils = api.useUtils()

  useEffect(() => {
    if (notifications?.some((notification) => !notification.readAt)) {
      utils.notifications.hasUnread.invalidate()
    }
  }, [notifications, utils])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">通知</h2>
      </div>

      <div className="space-y-6">
        {notifications?.map((notification) => (
          <ValUserNotification
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  )
}

const ValUserNotification = ({
  notification,
}: {
  notification: typeof notificationSchema.$inferSelect
}) => {
  const data = notification.data as NotificationData
  const utils = api.useUtils()
  const { mutate: read } = api.notifications.read.useMutation({
    onSuccess: () => {
      utils.notifications.hasUnread.invalidate()
    },
  })
  const [isRead, setIsRead] = useState(!!notification.readAt)
  const [hidden, setHidden] = useState(false)

  const handleRead = useMemo(() => {
    let timeout: NodeJS.Timeout
    return () => {
      if (!notification.readAt) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          read(
            { id: notification.id },
            {
              onSuccess: () => {
                utils.notifications.hasUnread.invalidate()
              },
            }
          )
        }, 300)
      }
    }
  }, [notification.id, read, utils, notification.readAt])

  return (
    <div className="relative border-b border-gray-200 pb-4">
      <ValUserNotificationTitle title={data.title} />
      <ValUserNotificationContent content={data.content} />
      <AnimatePresence>
        {!notification.readAt && !hidden && (
          <motion.button
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            exit={{
              opacity: 0,
            }}
            className={cn(
              badgeVariants({ variant: 'secondary' }),
              'absolute right-0 top-0 cursor-pointer transition-colors hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white'
            )}
            whileHover={{
              borderRadius: '12px',
            }}
            onHoverStart={() => {
              setIsRead(true)
              handleRead()
            }}
            onHoverEnd={() => {
              setHidden(true)
            }}
          >
            {isRead ? '已读' : '未读'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

const ValUserNotificationTitle = ({ title }: { title?: string }) => {
  return <h3 className="text-lg font-semibold">{title}</h3>
}

const ValUserNotificationContent = ({ content }: { content?: string }) => {
  return <p className="text-sm text-muted-foreground">{content}</p>
}

type NotificationData = {
  title?: string
  content?: string
} & {
  link?: string
}

export { ValUserNotifications }