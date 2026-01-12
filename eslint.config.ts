import { tanstackConfig } from '@tanstack/eslint-config'

export default [
    ...tanstackConfig,
    {
        rules: {
            // Enforce T[] instead of Array<T> for arrays
            '@typescript-eslint/array-type': ['error', { default: 'array' }],

            // Disable unused vars errors (warnings only)
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],

            // Allow explicit any types in some cases
            '@typescript-eslint/no-explicit-any': 'warn',

            // Disable implicit any errors (too many to fix at once)
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
        },
    },
]