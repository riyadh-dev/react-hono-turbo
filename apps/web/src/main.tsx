import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import '@/index.css'
import { routeTree } from '@/route-tree.gen'

import { useAuth } from './auth-context'
import { AuthProvider } from './auth-provider'

const queryClient = new QueryClient()

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	defaultPreloadStaleTime: 0,
	defaultPendingComponent: () => <div>Loading...</div>,
	context: { queryClient, auth: undefined! },
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
	const auth = useAuth()
	return <RouterProvider router={router} context={{ auth }} />
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</QueryClientProvider>
	)
}
