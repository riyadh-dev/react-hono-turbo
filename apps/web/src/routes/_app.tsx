import { createFileRoute, redirect } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/_app')({
	async beforeLoad() {
		const session = await authClient.getSession()
		if (!session.data?.user) redirect({ to: '/login', throw: true })

		return { session: session.data }
	},
})
