import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  resources: z.array(z.string()),
  users: z.array(z.string()),
})

export const updateRoleSchema = createRoleSchema.partial().extend({
  id: z.string(),
})
