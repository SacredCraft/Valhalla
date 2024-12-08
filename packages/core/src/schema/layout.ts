import { z } from 'zod'

export const matchContextSchema = z.object({
  resourceName: z.string(),
  resourceFolder: z.string(),
  filePath: z.string(),
  fileName: z.string(),
})

const layoutSchema = z.object({
  name: z.string(),
  component: z.string().optional(),
  icon: z.string().optional(),
  priority: z.number().default(0),
  match: z.function().args(matchContextSchema, z.any()).returns(z.boolean()),
})

type Layout = z.infer<typeof layoutSchema>

export { type Layout }
export { layoutSchema }
