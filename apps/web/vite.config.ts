import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	server: { port: 3000 },
	preview: { port: 3000 },
	resolve: {
		alias: { '@': path.resolve(__dirname, 'src') },
	},
	plugins: [
		react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
		TanStackRouterVite({ generatedRouteTree: './src/route-tree.gen.ts' }),
	],
})
