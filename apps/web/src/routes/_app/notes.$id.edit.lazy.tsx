import { useForm } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { Input } from '@/components/input'
import { TextArea } from '@/components/text-area'

import api from '@/lib/api'
import { tryCatch } from '@/lib/utils'

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

	const noteQuery = useSuspenseQuery({
		queryKey: ['note', id],
		async queryFn() {
			const res = await api.notes[':id'].$get({ param: { id } })
			return await res.json()
		},
	})

	const editNoteMutation = useMutation({
		async mutationFn(values: TSchema) {
			const res = await api.notes[':id'].$put({
				param: { id },
				form: values,
			})
			return await res.json()
		},
	})

	const [isError, setError] = useState(false)

	const form = useForm({
		defaultValues: {
			body: noteQuery.data.body,
			title: noteQuery.data.title,
		} as TSchema,
		validators: { onSubmit: schema },
		async onSubmit({ value }) {
			setError(false)

			const [, error] = await tryCatch(
				editNoteMutation.mutateAsync(value)
			)
			if (error) {
				setError(true)
				return
			}

			void queryClient.invalidateQueries({ queryKey: ['notes'] })
			void navigate({
				to: '/notes/$id',
				params: { id: id.toString() },
			})
		},
	})

	const isSubmitting = form.state.isSubmitting

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				void form.handleSubmit()
			}}
			className='space-y-4'
		>
			<form.Field name='title'>
				{(field) => (
					<Input
						label='Title'
						type='text'
						field={field}
						disabled={isSubmitting}
					/>
				)}
			</form.Field>

			<form.Field name='body'>
				{(field) => (
					<TextArea
						label='Body'
						field={field}
						disabled={isSubmitting}
					/>
				)}
			</form.Field>

			<form.Subscribe>
				<div className='space-y-2 text-right'>
					<button
						type='submit'
						disabled={isSubmitting}
						className='rounded-sm bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
					>
						Save
					</button>
					<div className='h-5 text-sm text-rose-600'>
						{isError && 'Failed to save note'}
					</div>
				</div>
			</form.Subscribe>
		</form>
	)
}
