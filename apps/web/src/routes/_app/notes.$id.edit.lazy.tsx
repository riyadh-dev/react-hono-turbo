import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import api from '@/lib/api'
import { useZodForm } from '@/lib/utils'

export const Route = createLazyFileRoute('/_app/notes/$id/edit')({
	component: NoteEditPage,
})

const schema = z.object({
	title: z.string().min(3),
	body: z.string().min(3),
})

type TSchema = z.infer<typeof schema>

function NoteEditPage() {
	const { id } = Route.useParams()
	const { queryClient } = Route.useRouteContext()
	const navigate = useNavigate()

	const addNoteMutation = useMutation({
		async mutationFn(values: TSchema) {
			const res = await api.notes[':id'].$put({
				param: { id },
				form: values,
			})
			return await res.json()
		},
		onSuccess() {
			void queryClient.invalidateQueries({ queryKey: ['notes'] })
			void navigate({
				to: '/notes/$id',
				params: { id: id.toString() },
			})
		},
	})

	const noteQuery = useSuspenseQuery({
		queryKey: ['note', id],
		async queryFn() {
			const res = await api.notes[':id'].$get({ param: { id } })
			return await res.json()
		},
	})

	const form = useZodForm({ schema, defaultValues: noteQuery.data })
	const onSubmit = form.handleSubmit((values) => {
		addNoteMutation.mutate(values)
	})

	return (
		<form onSubmit={onSubmit} className='space-y-4'>
			<div>
				<label className='flex w-full flex-col gap-1'>
					<span>Title: </span>
					<input
						{...form.register('title')}
						aria-invalid={!!form.formState.errors.title}
						aria-errormessage={
							form.formState.errors.title
								? 'title-error'
								: undefined
						}
						disabled={addNoteMutation.isPending}
						className='w-full rounded border border-gray-400 bg-transparent px-4 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:text-gray-300'
					/>
				</label>
				{form.formState.errors.title && (
					<div className='pt-1 text-red-700' id='title-error'>
						{form.formState.errors.title.message}
					</div>
				)}
			</div>

			<div>
				<label className='flex w-full flex-col gap-1'>
					<span>Body: </span>
					<textarea
						{...form.register('body')}
						rows={8}
						aria-invalid={!!form.formState.errors.body}
						aria-errormessage={
							form.formState.errors.body
								? 'body-error'
								: undefined
						}
						disabled={addNoteMutation.isPending}
						className='w-full rounded border border-gray-400 bg-transparent px-4 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:text-gray-300'
					/>
				</label>
				{form.formState.errors.body && (
					<div className='pt-1 text-red-700' id='body-error'>
						{form.formState.errors.body.message}
					</div>
				)}
			</div>

			<div className='text-right'>
				<button
					type='submit'
					disabled={addNoteMutation.isPending}
					className='rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400'
				>
					Save
				</button>
			</div>
		</form>
	)
}
