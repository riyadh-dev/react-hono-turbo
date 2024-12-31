import { useQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import api from '@/lib/api'
import { useZodForm } from '@/lib/utils'

export const Route = createLazyFileRoute('/_auth/login')({
	component: LoginPage,
})

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

type TForm = z.infer<typeof schema>

function LoginPage() {
	const { auth } = Route.useRouteContext()
	const router = useRouter()
	const form = useZodForm({ schema })

	const [isPending, setIsPending] = useState(false)
	const [isError, setIsError] = useState(false)

	function signIn(form: TForm) {
		setIsPending(true)
		auth.signIn(form)
			.then(() => router.invalidate())
			.catch(() => {
				setIsError(true)
			})
			.finally(() => {
				setIsPending(false)
			})
	}

	const mockUserQuery = useQuery({
		queryKey: ['mock-user'],
		async queryFn() {
			const res = await api.users.mock.$get()
			if (!res.ok) throw Error('Failed to fetch mock user')
			return await res.json()
		},
	})

	const onSubmit = form.handleSubmit(signIn)

	function onMockSignIn() {
		if (!mockUserQuery.data) return
		signIn({
			email: mockUserQuery.data.email,
			password: 'password',
		})
	}

	return (
		<div className='h-svh content-center'>
			<div className='mx-auto max-w-md px-8'>
				<form onSubmit={onSubmit} noValidate className='space-y-3'>
					<div className='space-y-2'>
						<label htmlFor='email' className='block font-medium'>
							Email address
						</label>

						<input
							id='email'
							required
							type='email'
							autoComplete='email'
							aria-describedby='email-error'
							{...form.register('email')}
							disabled={isPending}
							className='w-full rounded border border-gray-400 bg-transparent px-4 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:text-gray-300'
						/>

						<div
							className='h-5 text-sm text-rose-600'
							id='email-error'
						>
							{form.formState.errors.email?.message}
						</div>
					</div>

					<div className='space-y-2'>
						<label htmlFor='password' className='block font-medium'>
							Password
						</label>

						<input
							id='password'
							type='password'
							autoComplete='current-password'
							aria-describedby='password-error'
							{...form.register('password')}
							disabled={isPending}
							className='w-full rounded border border-gray-400 bg-transparent px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:text-gray-300'
						/>

						<div
							className='h-5 text-sm text-rose-600'
							id='password-error'
						>
							{form.formState.errors.password?.message}
						</div>
					</div>

					<div className='space-y-2'>
						<div className='space-y-4'>
							<button
								type='submit'
								disabled={isPending}
								className='w-full rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
							>
								Log in
							</button>
							<button
								type='button'
								disabled={isPending || !mockUserQuery.data}
								onClick={onMockSignIn}
								className='w-full animate-pulse rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 focus:bg-orange-400 disabled:bg-orange-300'
							>
								Mock Log in
							</button>
						</div>

						<div className='h-5 text-center text-sm text-rose-600'>
							{isError && 'Invalid email or password'}
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
