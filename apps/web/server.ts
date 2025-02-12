import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import chalk from 'chalk'

import { configuration, Server } from '@valhalla/collaboration'
import { systemConfig } from '@valhalla/core/config'
import { initLifeCycle } from '@valhalla/core/life-cycle'
import { getRegistry } from '@valhalla/core/resource'

import './resources'
import '@valhalla/core/init'

import { WebSocketServer } from 'ws'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const app = next({
  dev,
  hostname,
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
    if (!req.url) return
    const parsedUrl = parse(req.url!, true)
    return handler(req, res, parsedUrl)
  })

  const wss = new WebSocketServer({ server })

  const hocuspocus = Server.configure(configuration())

  wss.on('connection', (server, request) => {
    hocuspocus.handleConnection(server, request)
  })

  const originalOn = server.on.bind(server)
  server.on = function (event, listener) {
    return event !== 'upgrade' ? originalOn(event, listener) : server
  }

  server.once('error', (err) => {
    console.error(err)
    process.exit(1)
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
  console.log(` - Network:    http://${hostname}:${port}`)
  console.log(` - WebSocket:  ws://${hostname}:${port}`)
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
