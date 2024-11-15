import { z } from 'zod'

import { configSchema } from './configs'

const resourceSchema = z.object({
  // 资源名称 (唯一)
  name: z.string(),
  // 资源描述
  description: z.string().optional(),
  // 资源配置
  config: configSchema.optional(),
})

type Resource = z.infer<typeof resourceSchema>

export { resourceSchema }
export type { Resource }
