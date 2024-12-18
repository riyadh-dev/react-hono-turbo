import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { IAuthContext } from '@/auth-context'

interface IContext {
	queryClient: QueryClient
	auth: IAuthContext
}

export const Route = createRootRouteWithContext<IContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<Outlet />
			<div className='pointer-events-none absolute inset-0 z-10 bg-[url(/noise.png)] bg-[size:8rem] opacity-5' />
			<TanStackRouterDevtools position='bottom-right' />
		</>
	)
}
