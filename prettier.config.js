/** @type {import('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  endOfLine: 'lf',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-packagejson',
  ],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '',
    '^@valhalla/(.*)$',
    '',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
  importOrderTypeScriptVersion: '5.6.3',
}

export default config
