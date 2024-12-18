import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import fs from 'fs-extra'
import yaml from 'yaml'

fs.ensureFileSync('configs/system.yaml')
const config = yaml.parse(fs.readFileSync('configs/system.yaml', 'utf8'))

let updates: any = {
  ...config,
}

if (!config?.database?.url) {
  updates.database = {
    url: await input({
      message: '请输入数据库 URL',
    }),
  }
}

if (!config?.['better-auth']?.secret) {
  updates['better-auth'] = {
    secret: await input({
      message: '请输入 Better Auth 的 API 密钥 (留空则自动生成)',
      default: Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => {
          const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
          return (
            chars[b % chars.length] +
            chars[Math.floor(b / chars.length) % chars.length]
          )
        })
        .join(''),
    }),
  }
}

if (!config?.users?.avatar) {
  console.log(chalk.blue('检测到未配置头像，将使用默认配置'))
  updates.users = {
    avatar: {
      'max-size': 2048,
      accept: 'image/*',
      width: 200,
      height: 200,
      path: './files/avatars',
      quality: 80,
    },
  }
}

fs.writeFileSync('configs/system.yaml', yaml.stringify(updates))

console.log(chalk.green('配置文件初始化完成'))
