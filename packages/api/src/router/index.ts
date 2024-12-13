import { pub } from '../orpc'
import { avatarRouter } from './avatar'
import { filesRouter } from './files'
import { notificationsRouter } from './notifications'
import { pathsRouter } from './paths'
import { resourcesRouter } from './resources'
import { sponsorsRouter } from './sponsors'
import { usersRouter } from './users'

export const router = pub.router({
  files: filesRouter,
  notifications: notificationsRouter,
  resources: resourcesRouter,
  sponsors: sponsorsRouter,
  avatar: avatarRouter,
  paths: pathsRouter,
  users: usersRouter,
})
