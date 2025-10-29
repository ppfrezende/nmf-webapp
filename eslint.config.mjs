import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('@rocketseat/eslint-config/next'),
  ...compat.extends('plugin:@next/next/recommended'),
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'prettier/prettier': ['error', { trailingComma: 'es5' }],
      camelcase: 'off',
    },
  },
]

export default eslintConfig
