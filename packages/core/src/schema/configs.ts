import { z } from 'zod'

const configSchema = z.object({
  name: z.string(),
  version: z.string(),
  content: z.instanceof(z.Schema),
  path: z.string(),
})

type Config = z.infer<typeof configSchema>

export type { Config }
export { configSchema }

export * from './system-config'
