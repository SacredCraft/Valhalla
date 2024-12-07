import { z } from 'zod'

export const componentSchema = z.object({
  name: z.string(),
  component: z.string(),
})

export type Component = z.infer<typeof componentSchema>
