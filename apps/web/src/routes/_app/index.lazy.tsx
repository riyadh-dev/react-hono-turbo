import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'

export const Route = createLazyFileRoute('/_app/')({
	component: HomeComponent,
})

function HomeComponent() {
	const { user } = Route.useRouteContext().session!

	const navigate = useNavigate()

	const signOut = () =>
		void authClient.signOut({
			fetchOptions: {
				async onSuccess() {
					await navigate({ to: '/login' })
				},
			},
		})

	return (
		<main className='relative min-h-screen content-center space-y-16'>
			<h1 className='mx-auto w-fit bg-gradient-to-r from-indigo-400 via-purple-500 to-rose-500 bg-clip-text text-center text-7xl font-extrabold tracking-tight text-transparent'>
				REACT HONO TURBO
			</h1>

			<p className='text-center text-2xl font-semibold'>
				Welcome, {user.name}!
			</p>

			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex flex-wrap justify-center gap-8'>
					{[
						{
							src: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
							alt: 'React',
							href: 'https://react.dev/',
						},
						{
							src: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Hono-logo.svg',
							alt: 'Hono',
							href: 'https://hono.dev/',
						},
						{
							src: '/turborepo.svg',
							alt: 'Turbo',
							href: 'https://turbo.build/repo/docs',
						},
					].map((img) => (
						<a
							key={img.href}
							href={img.href}
							className='flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0'
						>
							<img
								alt={img.alt}
								src={img.src}
								className='object-contain'
							/>
						</a>
					))}
				</div>
			</div>

			<button
				onClick={signOut}
				className='absolute bottom-2 left-2 rounded bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
			>
				Sign out
			</button>
		</main>
	)
}
