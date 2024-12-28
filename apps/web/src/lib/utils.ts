import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

type TUseZodFormProps<F extends FieldValues> = {
	schema: z.Schema<F>
} & Omit<UseFormProps<F>, 'resolver'>

export function useZodForm<F extends FieldValues>(props: TUseZodFormProps<F>) {
	return useForm<F>({
		resolver: zodResolver(props.schema),
		...props,
	})
}
