import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { authClient } from '@/lib/auth-client'
import { useZodForm } from '@/lib/utils'

export const Route = createLazyFileRoute('/_auth/login')({
	component: LoginPage,
})

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

function LoginPage() {
	const [isPending, setIsPending] = useState(false)
	const [isError, setIsError] = useState(false)

	const navigate = useNavigate()

	const form = useZodForm({ schema })

	const onSubmit = form.handleSubmit(async (values) => {
		setIsError(false)

		await authClient.signIn.email(
			{
				...values,
			},
			{
				onRequest: () => setIsPending(true),
				onError() {
					setIsError(true)
					setIsPending(false)
				},
				onSuccess() {
					setIsPending(false)
					void navigate({ to: '/', replace: true })
				},
			}
		)
	})

	return (
		<div className='flex h-svh flex-col justify-center'>
			<div className='mx-auto w-full max-w-md px-8'>
				<form onSubmit={onSubmit} noValidate className='space-y-6'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium'
						>
							Email address
						</label>
						<div className='mt-1'>
							<input
								id='email'
								required
								type='email'
								autoComplete='email'
								aria-describedby='email-error'
								{...form.register('email')}
								disabled={isPending}
								className='w-full rounded border border-gray-400 bg-transparent px-2 py-1 text-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:text-gray-300'
							/>
							<div
								className='pt-1 text-sm text-rose-600'
								id='email-error'
							>
								{form.formState.errors.email?.message}
							</div>
						</div>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium'
						>
							Password
						</label>
						<div className='mt-1'>
							<input
								id='password'
								type='password'
								autoComplete='current-password'
								aria-describedby='password-error'
								{...form.register('password')}
								disabled={isPending}
								className='w-full rounded border border-gray-400 bg-transparent px-2 py-1 text-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:text-gray-300'
							/>

							<div
								className='pt-1 text-sm text-rose-600'
								id='password-error'
							>
								{form.formState.errors.password?.message}
							</div>
						</div>
					</div>

					<button
						type='submit'
						disabled={isPending}
						className='w-full rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
					>
						Log in
					</button>

					<div className='text-center text-rose-600'>
						{isError && 'Invalid email or password'}
					</div>

					<div className='text-center text-sm text-gray-300'>
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
