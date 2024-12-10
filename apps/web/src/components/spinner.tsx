export default function Spinner() {
	return (
		<div className='flex h-full items-center justify-center'>
			<div
				className='size-12 animate-spin rounded-full border-4 border-indigo-500 border-e-transparent'
				role='status'
			/>
		</div>
	)
}
