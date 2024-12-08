import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { authClient } from '@/lib/auth-client'

interface IContext {
	queryClient: QueryClient
	session: (typeof authClient.$Infer)['Session'] | null
}

export const Route = createRootRouteWithContext<IContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<Outlet />
			<div className='pointer-events-none fixed inset-0 z-10 bg-[url(/noise.png)] opacity-5' />
			<TanStackRouterDevtools position='bottom-right' />
		</>
	)
}
