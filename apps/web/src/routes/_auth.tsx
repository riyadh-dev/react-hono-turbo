import { createFileRoute, redirect } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/_auth')({
	async beforeLoad() {
		const session = await authClient.getSession()
		if (session.data?.user)
			redirect({ to: '/', throw: true, replace: true })
	},
})
