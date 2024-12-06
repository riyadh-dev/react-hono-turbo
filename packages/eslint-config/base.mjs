import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import ts from 'typescript-eslint'

/** @type {import("eslint").Linter.Config} */
export default [
	{ ignores: ['dist', 'build', 'eslint.config.mjs'] },
	js.configs.recommended,
	...ts.configs.recommendedTypeChecked,
	...ts.configs.stylisticTypeChecked,
	prettier,
	{
		rules: {
			'@typescript-eslint/no-deprecated': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_' },
			],
		},
	},
]
