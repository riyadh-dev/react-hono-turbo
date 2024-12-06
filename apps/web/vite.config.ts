import svgrJsx from '@svgr/plugin-jsx'
import svgrSvgo from '@svgr/plugin-svgo'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
	server: { port: 3000 },
	preview: { port: 3000 },
	resolve: {
		alias: { '@': path.resolve(__dirname, 'src') },
	},
	plugins: [
		react(),
		TanStackRouterVite({ generatedRouteTree: './src/route-tree.gen.ts' }),
		svgr({
			svgrOptions: {
				plugins: [svgrSvgo, svgrJsx],
				svgoConfig: { floatPrecision: 2 },
			},
		}),
	],
})
