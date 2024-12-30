import { hcWithType } from 'api/hc'

export default hcWithType(import.meta.env.VITE_API_URL, {
	init: { credentials: 'include' },
}).api

console.log('API: ', import.meta.env.VITE_API_URL)
