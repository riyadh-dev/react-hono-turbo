import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useAuth } from '@/auth-context'

import Spinner from './spinner'

export default function RouteError({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	const auth = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (error.message === 'UNAUTHORIZED') {
			auth.signOut().then(() => navigate({ to: '/login' }))
		}
	}, [auth, error.message, navigate])

	if (error.message === 'UNAUTHORIZED') return <Spinner />

	return (
		<div className='grid h-full place-items-center'>
			<div className='space-y-4 text-center'>
				<h1 className='text-2xl font-bold text-red-500'>
					Something went wrong
				</h1>
				<p className='text-lg font-semibold text-red-500'>
					Reason: {error.message}
				</p>
				<button
					className='rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
					onClick={reset}
				>
					Try again
				</button>
			</div>
		</div>
	)
}
