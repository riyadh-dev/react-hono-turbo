import { hcWithType } from 'api/hc'

export default hcWithType(import.meta.env.VITE_API_URL, {
	init: { credentials: 'include' },
}).api
