import { z } from 'zod'

const layoutSchema = z.object({
  name: z.string(),
  match: z.function().args(z.unknown()).returns(z.boolean()),
  component: z.string(),
  icon: z.string().optional(),
})

type Layout = z.infer<typeof layoutSchema>

export { type Layout }
export { layoutSchema }
