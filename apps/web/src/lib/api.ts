import { hcWithType } from 'api/hc'

const honoClient = hcWithType(import.meta.env.VITE_API_URL, {
	init: { credentials: 'include' },
})

export default honoClient.api
