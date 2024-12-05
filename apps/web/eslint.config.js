import next from '@valhalla/eslint-config/next.js'

export default [
  {
    ignores: ['dist', 'node_modules', '.next/', 'out/', 'postcss.config.mjs'],
  },
  ...next,
]
