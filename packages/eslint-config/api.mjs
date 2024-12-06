import base from './base.mjs'

/** @type {import("eslint").Linter.Config} */
export default [
	...base,
	{
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: process.cwd(),
			},
		},
	},
]
