import { z } from 'zod'

export const iconSchema = z
  .object({
    name: z.string(),
    component: z.string(),
  })
  .and(
    z.object({
      names: z.array(z.string()).optional(),
    })
  )
  .and(
    z
      .object({
        defaultExport: z.literal(true).optional(),
      })
      .or(
        z.object({
          defaultExport: z.literal(false).optional(),
          exportName: z.string().optional(),
        })
      )
  )

export type Icon = z.infer<typeof iconSchema>
