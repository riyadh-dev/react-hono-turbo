import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

import api from '@/lib/api'

export const Route = createLazyFileRoute('/_app/notes/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	const noteQuery = useSuspenseQuery({
		queryKey: ['note', id],
		async queryFn() {
			const res = await api.notes[':id'].$get({ param: { id } })
			return await res.json()
		},
	})

	return (
		<div>
			<h3 className='text-2xl font-bold'>{noteQuery.data.title}</h3>
			<p className='py-6'>{noteQuery.data.body}</p>
			<hr className='my-4' />
			<button
				type='submit'
				className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400'
			>
				Delete
			</button>
		</div>
	)
}
