import { z } from 'zod'

const layoutSchema = z.object({
  name: z.string(),
})

type Layout = z.infer<typeof layoutSchema>

export { type Layout }
export { layoutSchema }
