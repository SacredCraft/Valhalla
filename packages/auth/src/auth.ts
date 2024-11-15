import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'

import { systemConfig } from '@valhalla/core/config'
import { db } from '@valhalla/db'

import { preventSignup } from './plugins/prevent-signup'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin(), preventSignup],
  trustedOrigins: [
    'better-auth://',
    'exp://',
    systemConfig.betterAuth.url,
  ].filter((url) => url !== undefined),
  secret: systemConfig.betterAuth.secret,
})
