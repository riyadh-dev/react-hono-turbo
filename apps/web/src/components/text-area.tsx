import { AnyFieldApi } from '@tanstack/react-form'

export function TextArea({
	label,
	disabled,
	field,
}: {
	label: string
	disabled?: boolean
	field: AnyFieldApi
}) {
	return (
		<div className='space-y-2'>
			<label htmlFor={field.name} className='block font-medium'>
				{label}
			</label>

			<textarea
				id={field.name}
				name={field.name}
				aria-describedby={`${field.name}-error`}
				rows={8}
				value={field.state.value as string}
				onBlur={field.handleBlur}
				disabled={disabled}
				onChange={(e) => field.handleChange(e.target.value)}
				className='w-full rounded-sm border border-gray-400 bg-transparent px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:text-gray-300'
			/>

			<div
				id={`${field.name}-error`}
				className='h-5 text-sm text-rose-600'
			>
				{field.state.meta.errors
					.map((err: { message: string }) => err?.message)
					.join(',')}
			</div>
		</div>
	)
}
