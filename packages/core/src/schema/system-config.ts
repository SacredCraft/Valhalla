import { z } from 'zod'

import { Config } from './configs'

const avatarConfigSchema = z.object({
  maxSize: z
    .number()
    .optional()
    .default(1024 * 1024),
  accept: z.string().optional().default('image/*'),
  width: z.number().optional().default(200),
  height: z.number().optional().default(200),
  path: z.string().optional().default('uploads/avatars'),
  quality: z.number().optional().default(80),
})

const userConfigSchema = z.object({
  avatar: avatarConfigSchema.optional().default({}),
})

const systemConfigSchema = z.object({
  users: userConfigSchema.optional().default({}),
  betterAuth: z.object({
    secret: z.string(),
    url: z.string().optional(),
  }),
  database: z.object({
    url: z.string(),
  }),
})

const systemConfigMeta = {
  name: 'System',
  version: '0.0.1',
  path: 'system.yaml',
  content: systemConfigSchema,
} satisfies Config

type SystemConfig = z.infer<typeof systemConfigSchema>
type UserConfig = z.infer<typeof userConfigSchema>
type AvatarConfig = z.infer<typeof avatarConfigSchema>

export {
  systemConfigSchema,
  userConfigSchema,
  avatarConfigSchema,
  systemConfigMeta,
}
export type { SystemConfig, UserConfig, AvatarConfig }
