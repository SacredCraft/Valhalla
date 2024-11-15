import type { Config } from 'drizzle-kit'

import { systemConfig } from '@valhalla/core/config'

export default {
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: systemConfig.database.url,
  },
} satisfies Config
