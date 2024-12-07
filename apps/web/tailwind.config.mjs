/** @type {import("eslint").Linter.Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['GeistSans', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
