import { serve } from '@hono/node-server'
import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '@valhalla/db'
import { user } from '@valhalla/db/schema'

import { auth } from '../src/auth'

const app = new Hono()

app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw)
})

const server = serve(app)

function cleanup() {
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)
process.on('SIGQUIT', cleanup)

if (await db.select().from(user).where(eq(user.role, 'admin'))) {
  const confirm = await input({
    message: '管理员已存在，是否覆盖？',
    default: 'n',
  })
  if (confirm !== 'y' && confirm !== 'Y') {
    process.exit(0)
  }
}

const email = await input({
  message: '请输入管理员邮箱',
})

const name = await input({
  message: '请输入管理员名称',
})

const password = await input({
  message: '请输入管理员密码',
})

const admin = await auth.api.signUpEmail({
  body: {
    email,
    password,
    name,
  },
})

const userId = admin.user.id

await db
  .update(user)
  .set({
    id: userId,
    role: 'admin',
  })
  .where(eq(user.id, userId))

console.log(chalk.green('管理员初始化完成'))
cleanup()
