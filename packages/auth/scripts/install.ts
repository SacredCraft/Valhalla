import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import { eq } from 'drizzle-orm'
import fs from 'fs-extra'

import { db } from '@valhalla/db'
import { user } from '@valhalla/db/schema'

import { auth } from '../src/auth'

const admins = await db
  .select()
  .from(user)
  .where(eq(user.role, 'admin'))
  .execute()

if (admins.length > 0) {
  const confirm = await input({
    message: '管理员已存在，是否新增？',
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

fs.writeFileSync('users.json', JSON.stringify({}, null, 2))

const admin = await auth.api.signUpEmail({
  body: {
    email,
    password,
    name,
  },
})

await db
  .update(user)
  .set({
    role: 'admin',
  })
  .where(eq(user.id, admin.id))
  .execute()

console.log(chalk.green('管理员初始化完成'))
process.exit(0)
