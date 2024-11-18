import { z } from 'zod'

import { configSchema } from './configs'

const resourceSchema = () =>
  z.object({
    name: z.string(),
    description: z.string().optional(),
    config: configSchema.optional(),
  })

type Resource = z.infer<ReturnType<typeof resourceSchema>>

export { resourceSchema }
export type { Resource }
