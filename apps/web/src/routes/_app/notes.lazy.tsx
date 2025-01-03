import { useSuspenseQuery } from '@tanstack/react-query'
import {
	Link,
	Outlet,
	createLazyFileRoute,
	useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'

import api from '@/lib/api'

export const Route = createLazyFileRoute('/_app/notes')({
	component: NotesPage,
})

function NotesPage() {
	const { auth } = Route.useRouteContext()
	const navigate = useNavigate()

	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const closeSidebar = () => setIsSidebarOpen(false)

	const signOut = () =>
		void auth.signOut().then(() => navigate({ to: '/login' }))

	const notesQuery = useSuspenseQuery({
		queryKey: ['notes'],
		async queryFn() {
			const res = await api.notes.$get()
			return await res.json()
		},
	})

	const user = auth.user!
	return (
		<div className='flex h-full min-h-screen flex-col'>
			<header className='flex h-20 items-center justify-between bg-stone-900 px-4 text-white'>
				<h1 className='text-3xl font-semibold'>
					<Link to='/'>Notes</Link>
				</h1>
				<p className='max-md:hidden'>{user.email}</p>
				<button
					onClick={signOut}
					className='rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600'
				>
					Logout
				</button>
			</header>

			<main className='flex grow items-stretch'>
				<div className='w-80 border-r border-stone-400 max-md:hidden'>
					<SidebarInner notes={notesQuery.data} />
				</div>

				{isSidebarOpen ? (
					<div className='fixed left-0 top-20 flex h-[calc(100svh-5rem)] w-80 flex-col bg-stone-900 pb-8 md:hidden'>
						<SidebarInner
							notes={notesQuery.data}
							close={closeSidebar}
						/>

						<button
							className='mx-auto mt-auto size-10 rounded-full bg-indigo-500'
							onClick={() => setIsSidebarOpen(false)}
						>
							X
						</button>
					</div>
				) : (
					<button
						className='fixed -left-2 top-1/2 z-40 size-10 translate-y-1/2 rounded-full bg-indigo-500 md:hidden'
						onClick={() => setIsSidebarOpen(true)}
					>
						{'->'}
					</button>
				)}

				<div className='flex-1 p-6'>
					<Outlet />
				</div>
			</main>
		</div>
	)
}

function SidebarInner({
	notes,
	close,
}: {
	notes: { id: number; title: string }[]
	close?: () => void
}) {
	return (
		<>
			<Link
				to='/notes/new'
				onClick={close}
				className='block border-b border-stone-400 p-4 text-lg text-indigo-500'
			>
				+ New Note
			</Link>
			{notes.length === 0 ? (
				<p className='p-4'>No notes yet</p>
			) : (
				<ol>
					{notes.map((note) => (
						<li key={note.id}>
							<Link
								to='/notes/$id'
								onClick={close}
								params={{ id: note.id.toString() }}
								className='block truncate border-b border-stone-400 p-4 text-lg'
							>
								📝 {note.title}
							</Link>
						</li>
					))}
				</ol>
			)}
		</>
	)
}
