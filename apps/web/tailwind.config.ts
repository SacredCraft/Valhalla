import preset from '@valhalla/tailwind'
import type { Config } from 'tailwindcss'

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
