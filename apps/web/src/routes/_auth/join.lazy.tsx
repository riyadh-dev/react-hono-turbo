import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { useZodForm } from '@/lib/utils'

export const Route = createLazyFileRoute('/_auth/join')({
	component: JoinPage,
})

const schema = z.object({
	username: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
})

function JoinPage() {
	const { auth } = Route.useRouteContext()
	const form = useZodForm({ schema })

	const [isPending, setIsPending] = useState(false)
	const [isError, setIsError] = useState(false)

	const navigate = useNavigate()

	const onSubmit = form.handleSubmit((form) => {
		auth.signUp(form)
			.then(() => void navigate({ to: '/login' }))
			.catch(() => setIsError(true))
			.finally(() => setIsPending(false))
	})

	return (
		<div className='h-svh content-center'>
			<div className='mx-auto max-w-md px-8'>
				<form onSubmit={onSubmit} noValidate className='space-y-3'>
					<div className='space-y-2'>
						<label htmlFor='name' className='block font-medium'>
							Name
						</label>

						<input
							id='name'
							required
							type='text'
							autoComplete='name'
							aria-describedby='name-error'
							{...form.register('username')}
							disabled={isPending}
							className='w-full rounded border border-gray-400 bg-transparent px-4 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:text-gray-300'
						/>

						<div
							className='h-5 text-sm text-rose-600'
							id='name-error'
						>
							{form.formState.errors.username?.message}
						</div>
					</div>

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
						<button
							type='submit'
							disabled={isPending}
							className='w-full rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
						>
							Log in
						</button>
						<div className='h-5 text-center text-sm text-rose-600'>
							{isError && 'Invalid email or password'}
						</div>
					</div>

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
