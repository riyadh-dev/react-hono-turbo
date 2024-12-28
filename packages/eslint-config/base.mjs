import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import ts from 'typescript-eslint'

/** @type {import("eslint").Linter.Config} */
export default [
	{
		ignores: [
			'node_modules',
			'public',
			'.turbo',
			'dist',
			'build',
			'*.{js,cjs,mjs}',
		],
	},
	js.configs.recommended,
	...ts.configs.recommendedTypeChecked,
	...ts.configs.stylistic,
	prettier,
	{
		rules: {
			'@typescript-eslint/no-deprecated': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
			],
		},
	},
]
