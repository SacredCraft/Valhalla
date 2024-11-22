import { ReactElement, ReactNode } from 'react'
import { z } from 'zod'

const menuSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.function().args(z.unknown()).returns(z.custom<ReactElement>()),
  render: z.function().args(z.unknown()).returns(z.custom<ReactNode>()),
})

const layoutSchema = z.object({
  name: z.string(),
  match: z.function().args(z.unknown()).returns(z.boolean()),
  menus: z.array(menuSchema),
})

type Layout = z.infer<typeof layoutSchema>
type Menu = z.infer<typeof menuSchema>

export { type Layout, type Menu }
export { layoutSchema }
