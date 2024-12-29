import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import api from '@/lib/api'

export const Route = createLazyFileRoute('/_app/notes/$id/')({
	component: NotePage,
})

function NotePage() {
	const { id } = Route.useParams()
	const { queryClient } = Route.useRouteContext()
	const navigate = useNavigate()

	const noteQuery = useSuspenseQuery({
		queryKey: ['note', id],
		async queryFn() {
			const res = await api.notes[':id'].$get({ param: { id } })
			return await res.json()
		},
	})

	const deleteNoteMutation = useMutation({
		async mutationFn() {
			const res = await api.notes[':id'].$delete({ param: { id } })
			return await res.json()
		},
		onSuccess() {
			void queryClient.invalidateQueries({ queryKey: ['notes'] })
		},
	})

	const deleteNote = async () => {
		await deleteNoteMutation.mutateAsync()
		void navigate({ to: '/notes', replace: true })
	}

	return (
		<div>
			<h3 className='text-2xl font-bold'>{noteQuery.data.title}</h3>
			<p className='py-6'>{noteQuery.data.body}</p>
			<hr className='my-4' />
			<div className='flex gap-2'>
				<button
					onClick={deleteNote}
					disabled={deleteNoteMutation.isPending}
					className='rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
				>
					{deleteNoteMutation.isPending
						? 'Deleting...'
						: 'Delete Note'}
				</button>

				<Link
					to='/notes/$id/edit'
					params={{ id }}
					className='rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
				>
					Edit
				</Link>
			</div>
		</div>
	)
}
