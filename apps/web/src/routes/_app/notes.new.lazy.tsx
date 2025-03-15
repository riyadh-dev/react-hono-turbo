import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { Input } from '@/components/input'
import { TextArea } from '@/components/text-area'

import api from '@/lib/api'

export const Route = createLazyFileRoute('/_app/notes/new')({
	component: NewNotePage,
})

const schema = z.object({
	title: z.string().min(3),
	body: z.string().min(3),
})

type TSchema = z.infer<typeof schema>

function NewNotePage() {
	const { queryClient } = Route.useRouteContext()
	const navigate = useNavigate()

	const addNoteMutation = useMutation({
		async mutationFn(values: TSchema) {
			const res = await api.notes.$post({ form: values })
			return await res.json()
		},
	})

	const [isError, setError] = useState(false)

	const form = useForm({
		defaultValues: { body: '', title: '' } as TSchema,
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			try {
				const { noteId } = await addNoteMutation.mutateAsync(value)
				void queryClient.invalidateQueries({ queryKey: ['notes'] })
				void navigate({
					to: '/notes/$id',
					params: { id: noteId.toString() },
				})
			} catch {
				setError(true)
			}
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
						Add
					</button>
					<div className='h-5 text-sm text-rose-600'>
						{isError && 'Failed to add note'}
					</div>
				</div>
			</form.Subscribe>
		</form>
	)
}
