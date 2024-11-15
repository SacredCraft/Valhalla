import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import chalk from 'chalk'

import { systemConfig } from '@valhalla/core/config'
import { resources } from '@valhalla/core/resource'
import { init } from './resources'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, turbo: true })
const handler = app.getRequestHandler()

const version = process.env.npm_package_version

const injectEnv = (env: Record<string, string>) => {
  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value
  })
}

injectEnv({
  BETTER_AUTH_URL: systemConfig.betterAuth.url || '',
})

init()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    return handler(req, res, parsedUrl)
  })

  server.listen(port)

  console.log()
  console.log(
    ` ${chalk.bold(
      `${chalk.magenta('▲ Valhalla')} ${chalk.gray(version)} ${chalk.yellow(
        `[${process.env.NODE_ENV.toUpperCase()}]`
      )}`
    )}`
  )
  console.log()
  console.log(` - Local:      http://localhost:${port}`)
  console.log(` - Network:    http://0.0.0.0:${port}`)
  console.log()
  console.log(
    ` - Resources:  ${
      Object.keys(resources).length > 0
        ? Object.keys(resources).join(', ')
        : 'None'
    }`
  )
  console.log()
})
