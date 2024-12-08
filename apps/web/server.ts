import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import chalk from 'chalk'

import { systemConfig } from '@valhalla/core/config'
import { initLifeCycle } from '@valhalla/core/life-cycle'
import { getRegistry } from '@valhalla/core/resource'

import './resources'
import '@valhalla/core/init'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev,
  turbo: true,
})
const handler = app.getRequestHandler()

const plugins = {
  Collaboration: {},
  BetterAuth: {},
}

const version = process.env.npm_package_version

const injectEnv = (env: Record<string, string>) => {
  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value
  })
}

injectEnv({
  BETTER_AUTH_URL: systemConfig.betterAuth.url || '',
  NODE_ENV: 'development',
})

initLifeCycle()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    return handler(req, res, parsedUrl)
  })

  server.listen(port)

  console.log()
  console.log(
    ` ${chalk.bold(
      `${chalk.magenta('▲ Valhalla')} ${chalk.gray(version)} ${chalk.blue(
        `[${process.env.NODE_ENV.toUpperCase()}]`
      )}`
    )}`
  )
  console.log()
  console.log(` - Local:      http://localhost:${port}`)
  console.log(` - Network:    http://0.0.0.0:${port}`)
  console.log()
  console.log(` - Plugins:    ${Object.keys(plugins).join(', ')}`)
  console.log(
    ` - Resources:  ${
      Object.keys(getRegistry().resources).length > 0
        ? Object.keys(getRegistry().resources)
            .map((key) => {
              const resource = getRegistry().resources[key]
              return `${resource.label || resource.name} (${key})`
            })
            .join(', ')
        : 'None'
    }`
  )
  console.log()
})
