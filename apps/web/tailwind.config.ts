import type { Config } from 'tailwindcss'

import { config as preset } from '@valhalla/tailwind-config/src/config'

const config = {
  content: [
    './node_modules/@valhalla/design-system/src/components/ui/**/*.{ts,tsx}',
    './node_modules/@valhalla/design-system/src/components/layout/**/*.{ts,tsx}',
    './node_modules/@valhalla/design-system/src/components/collaboration/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
    './node_modules/@valhalla/example/src/**/*.{ts,tsx}',
  ],
  presets: [preset],
  theme: {
    extend: {
      container: {
        padding: '1rem',
        screens: {
          '2xl': '1024px',
        },
      },
    },
  },
} satisfies Config

export default config
