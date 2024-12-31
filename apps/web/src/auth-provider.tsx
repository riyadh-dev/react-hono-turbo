import { useQuery } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

import Spinner from '@/components/spinner'

import api from '@/lib/api'

import AuthContext, { ISignInForm, ISignUpForm, TUser } from '@/auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<TUser | null>(null)
	const isAuth = !!user

	async function signUp(form: ISignUpForm) {
		const res = await api.auth['sign-up'].$post({ form })
		if (!res.ok) throw Error('Failed to sign up')
	}

	async function signIn(form: ISignInForm) {
		const res = await api.auth['sign-in'].$post({ form })
		if (!res.ok) throw Error('Failed to sign in')
		const { user } = await res.json()
		setUser(user)
	}

	async function signOut() {
		await api.auth['sign-out'].$delete()
		setUser(null)
	}

	const userQuery = useQuery({
		queryKey: ['current-user'],
		async queryFn() {
			const res = await api.auth.me.$get()
			if (!res.ok) return null
			const { user } = await res.json()
			setUser(user)
			return user
		},
		retry: false,
		enabled: !isAuth,
		refetchInterval: Infinity,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})

	if (userQuery.isPending) return <Spinner />

	return (
		<AuthContext.Provider
			value={{
				isAuth,
				user,
				signUp,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
