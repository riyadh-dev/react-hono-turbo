import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { authClient } from '@/lib/auth-client'
import { useZodForm } from '@/lib/utils'

export const Route = createLazyFileRoute('/_auth/join')({
	component: JoinPage,
})

const schema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
})

function JoinPage() {
	const [isPending, setIsPending] = useState(false)
	const [isError, setIsError] = useState(false)

	const navigate = useNavigate()

	const form = useZodForm({ schema })

	const onSubmit = form.handleSubmit(async (values) => {
		setIsError(false)

		await authClient.signUp.email(
			{
				...values,
			},
			{
				onRequest: () => setIsPending(true),
				onError() {
					setIsError(true)
					setIsPending(false)
				},
				async onSuccess() {
					setIsPending(false)
					await navigate({ to: '/', replace: true })
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
							htmlFor='name'
							className='block text-sm font-medium text-gray-700'
						>
							Name
						</label>
						<div className='mt-1'>
							<input
								id='name'
								required
								type='text'
								autoComplete='name'
								aria-describedby='name-error'
								{...form.register('name')}
								disabled={isPending}
								className='w-full rounded border border-gray-500 px-2 py-1 text-lg disabled:bg-gray-50 disabled:text-gray-500'
							/>
							<div className='pt-1 text-red-700' id='name-error'>
								{form.formState.errors.name?.message}
							</div>
						</div>
					</div>

					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'
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
								className='w-full rounded border border-gray-500 px-2 py-1 text-lg disabled:bg-gray-50 disabled:text-gray-500'
							/>
							<div className='pt-1 text-red-700' id='email-error'>
								{form.formState.errors.email?.message}
							</div>
						</div>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'
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
								className='w-full rounded border border-gray-500 px-2 py-1 text-lg disabled:bg-gray-50 disabled:text-gray-500'
							/>

							<div
								className='pt-1 text-red-700'
								id='password-error'
							>
								{form.formState.errors.password?.message}
							</div>
						</div>
					</div>

					<button
						type='submit'
						disabled={isPending}
						className='w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300'
					>
						Sign up
					</button>

					<div className='text-center text-red-700'>
						{isError && 'Invalid email or password'}
					</div>

					<div className='text-center text-sm text-gray-500'>
						Don&apos;t have an account?{' '}
						<Link to='/login' className='text-blue-500 underline'>
							Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
