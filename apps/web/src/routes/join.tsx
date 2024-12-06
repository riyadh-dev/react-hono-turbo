import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/join')({
	component: JoinPage,
})

function JoinPage() {
	return (
		<div className='flex h-svh flex-col justify-center'>
			<div className='mx-auto w-full max-w-md px-8'>
				<form method='post' className='space-y-6'>
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
								name='email'
								type='email'
								autoComplete='email'
								aria-describedby='email-error'
								className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
							/>
							<div className='pt-1 text-red-700' id='email-error'>
								error placeholder
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
								name='password'
								type='password'
								autoComplete='new-password'
								aria-describedby='password-error'
								className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
							/>
							<div className='pt-1 text-red-700' id='email-error'>
								error placeholder
							</div>
						</div>
					</div>

					<button
						type='submit'
						className='w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400'
					>
						Create Account
					</button>
					<div className='flex items-center justify-center'>
						<div className='text-center text-sm text-gray-500'>
							Already have an account?{' '}
							<Link
								className='text-blue-500 underline'
								to='/login'
							>
								Log in
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
