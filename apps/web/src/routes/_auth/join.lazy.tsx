import { useForm } from '@tanstack/react-form'
import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { Input } from '@/components/input'

export const Route = createLazyFileRoute('/_auth/join')({
	component: JoinPage,
})

const schema = z.object({
	username: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
})

type TSchema = z.infer<typeof schema>

function JoinPage() {
	const { auth } = Route.useRouteContext()

	const navigate = useNavigate()

	const [isError, setError] = useState(false)

	const form = useForm({
		defaultValues: { email: '', username: '', password: '' } as TSchema,
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			await auth.signUp(value).catch(() => setError(true))
			void navigate({ to: '/login' })
		},
	})

	const isSubmitting = form.state.isSubmitting

	return (
		<div className='h-svh content-center'>
			<div className='mx-auto max-w-md px-8'>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						void form.handleSubmit()
					}}
					noValidate
					className='space-y-3'
				>
					<form.Field name='username'>
						{(field) => (
							<Input
								label='Username'
								type='text'
								field={field}
								disabled={isSubmitting}
							/>
						)}
					</form.Field>

					<form.Field name='email'>
						{(field) => (
							<Input
								label='Email'
								type='text'
								field={field}
								disabled={isSubmitting}
							/>
						)}
					</form.Field>

					<form.Field name='password'>
						{(field) => (
							<Input
								label='Password'
								type='password'
								field={field}
								disabled={isSubmitting}
							/>
						)}
					</form.Field>

					<form.Subscribe>
						<div className='space-y-2'>
							<button
								type='submit'
								disabled={isSubmitting}
								className='w-full rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
							>
								Sign Up
							</button>
							<div className='h-5 text-center text-sm text-rose-600'>
								{isError && 'Failed to sign up'}
							</div>
						</div>
					</form.Subscribe>

					<div className='text-center text-gray-300'>
						Already have an account?{' '}
						<Link to='/login' className='text-indigo-400 underline'>
							Log in
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
