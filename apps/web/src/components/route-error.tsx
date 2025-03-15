export default function RouteError({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	return (
		<div className='grid h-full place-items-center'>
			<div className='space-y-4 text-center'>
				<h1 className='text-2xl font-bold text-red-500'>
					Something went wrong
				</h1>
				<p className='text-lg font-semibold text-red-500'>
					Reason: {error.message}
				</p>

				<div className='flex justify-center gap-x-4'>
					<button
						className='rounded-sm bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
						onClick={reset}
					>
						Try again
					</button>

					<button
						className='rounded-sm bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 disabled:bg-indigo-300'
						onClick={() => window.location.reload()}
					>
						Reload
					</button>
				</div>
			</div>
		</div>
	)
}
