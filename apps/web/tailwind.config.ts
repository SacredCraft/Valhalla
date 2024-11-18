import type { Config } from 'tailwindcss'

import preset from '@valhalla/tailwind'

const config = {
  content: preset.content,
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
