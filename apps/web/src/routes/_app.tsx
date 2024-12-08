import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
	beforeLoad({ context }) {
		if (!context.auth.isAuth) redirect({ to: '/login', throw: true })
	},
})
