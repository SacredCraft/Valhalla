import { z } from 'zod'

import { configSchema } from './configs'

const resourceSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  config: configSchema.optional(),
})

const folderSchema = z.object({
  name: z.string(),
  path: z.string(),
})

type Resource = z.infer<typeof resourceSchema>
type Folder = z.infer<typeof folderSchema>

export { resourceSchema, folderSchema }
export type { Resource, Folder }
