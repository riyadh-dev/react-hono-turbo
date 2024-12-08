import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, Outlet, createLazyFileRoute } from '@tanstack/react-router'

import api from '@/lib/api'

export const Route = createLazyFileRoute('/_app/notes')({
	component: NotesPage,
})

function NotesPage() {
	const { user } = Route.useRouteContext().auth.session!

	const notesQuery = useSuspenseQuery({
		queryKey: ['notes'],
		async queryFn() {
			const res = await api.notes.$get()
			return await res.json()
		},
	})

	return (
		<div className='flex h-full min-h-screen flex-col'>
			<header className='flex items-center justify-between bg-stone-900 p-4 text-white'>
				<h1 className='text-3xl font-semibold'>
					<Link to='.'>Notes</Link>
				</h1>
				<p>{user.email}</p>
				<button
					type='submit'
					className='rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600'
				>
					Logout
				</button>
			</header>

			<main className='flex grow items-stretch'>
				<div className='w-80 border-r border-stone-400'>
					<Link
						to='/'
						className='block border-b border-stone-400 p-4 text-xl text-indigo-500'
					>
						+ New Note
					</Link>

					{notesQuery.data.length === 0 ? (
						<p className='p-4'>No notes yet</p>
					) : (
						<ol>
							{notesQuery.data.map((note) => (
								<li key={note.id}>
									<Link
										to='/notes/$id'
										params={{ id: note.id.toString() }}
										className='block border-b border-stone-400 p-4 text-xl'
									>
										📝 {note.title}
									</Link>
								</li>
							))}
						</ol>
					)}
				</div>

				<div className='flex-1 p-6'>
					<Outlet />
				</div>
			</main>
		</div>
	)
}
