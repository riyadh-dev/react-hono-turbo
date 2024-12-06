import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

import base from './base.mjs'

/** @type {import("eslint").Linter.Config} */
export default [
	...base,
	{
		ignores: [
			'eslint.config.mjs',
			'postcss.config.mjs',
			'tailwind.config.mjs',
		],
	},
	react.configs.flat.recommended,
	{
		languageOptions: {
			...react.configs.flat.recommended.languageOptions,
			globals: {
				...globals.serviceworker,
				...globals.browser,
			},
			parserOptions: {
				project: ['./tsconfig.app.json', './tsconfig.node.json'],
				tsconfigRootDir: process.cwd(),
			},
		},
	},
	{
		settings: { react: { version: 'detect' } },
		plugins: {
			react,
			'jsx-a11y': jsxA11y,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...jsxA11y.configs.strict.rules,
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			...reactHooks.configs.recommended.rules,
			'react/self-closing-comp': 'error',
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'@typescript-eslint/no-misused-promises': [
				'error',
				{ checksVoidReturn: { attributes: false } },
			],
		},
	},
]
