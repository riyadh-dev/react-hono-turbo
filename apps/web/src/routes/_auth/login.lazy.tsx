import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { Input } from '@/components/input'

import api from '@/lib/api'

export const Route = createLazyFileRoute('/_auth/login')({
	component: LoginPage,
})

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

type TSchema = z.infer<typeof schema>

function LoginPage() {
	const { auth } = Route.useRouteContext()
	const router = useRouter()

	const mockUserQuery = useQuery({
		queryKey: ['mock-user'],
		async queryFn() {
			const res = await api.users.mock.$get()
			if (!res.ok) throw Error('Failed to fetch mock user')
			return await res.json()
		},
	})

	const [isError, setError] = useState(false)

	const form = useForm({
		defaultValues: { email: '', password: '' } as TSchema,
		validators: { onSubmit: schema },
		async onSubmit({ value }) {
			setError(false)
			await auth.signIn(value).catch(() => setError(true))
			void router.invalidate()
		},
	})

	async function onMockSignIn() {
		if (!mockUserQuery.data) return
		setError(false)
		await auth
			.signIn({
				email: mockUserQuery.data.email,
				password: 'password',
			})
			.catch(() => setError(true))
		void router.invalidate()
	}

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

					<div className='space-y-2'>
						<div className='space-y-4'>
							<form.Subscribe>
								<button
									type='submit'
									disabled={isSubmitting}
									className='w-full rounded-sm bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
								>
									Log In
								</button>
							</form.Subscribe>
							<button
								type='button'
								disabled={!mockUserQuery.data || isSubmitting}
								onClick={onMockSignIn}
								className='w-full animate-pulse rounded-sm bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 focus:bg-orange-400 disabled:bg-orange-300'
							>
								Mock Log in
							</button>
						</div>

						<div className='h-5 text-center text-sm text-rose-600'>
							{isError && 'Failed to sign up'}
						</div>
					</div>

					<div className='text-center text-gray-300'>
						Don&apos;t have an account?{' '}
						<Link to='/join' className='text-indigo-400 underline'>
							Sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
