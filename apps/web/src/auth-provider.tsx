import { hcWithType } from 'api/hc'
import { ReactNode, useEffect, useState } from 'react'

import Spinner from '@/components/spinner'

import AuthContext, { ISignInForm, ISignUpForm, TSession } from '@/auth-context'

const baseApi = hcWithType(import.meta.env.VITE_API_URL, {
	init: { credentials: 'include' },
}).api

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isPending, setIsPending] = useState(true)
	const [session, setSession] = useState<TSession | null>(null)
	const isAuth = !!session

	function getAuthHeader() {
		return {
			Authorization: session ? `Bearer ${session.accessToken}` : '',
		}
	}

	async function signUp(form: ISignUpForm) {
		await baseApi.auth['sign-up'].$post({ form })
	}

	async function signIn(form: ISignInForm) {
		const res = await baseApi.auth['sign-in'].$post({ form })
		const session = await res.json()
		setSession(session)
	}

	async function signOut() {
		await baseApi.auth['sign-out'].$delete(undefined, {
			headers: getAuthHeader(),
		})
		setSession(null)
	}

	useEffect(() => {
		async function refresh() {
			const res = await baseApi.auth.refresh.$put()
			if (res.status !== 200) return
			const session = await res.json()
			setSession(session)
		}

		void refresh().finally(() => setIsPending(false))
	}, [])

	if (isPending) return <Spinner />

	const { api } = hcWithType(import.meta.env.VITE_API_URL, {
		init: {
			credentials: 'include',
			headers: getAuthHeader(),
		},
		async fetch(input, requestInit, _, __) {
			const res = await fetch(input, requestInit)
			if (res.status !== 401) return res

			const refreshRes = await baseApi.auth.refresh.$put()
			if (refreshRes.status !== 200) return res

			const newSession = await refreshRes.json()
			setSession(newSession)
			return await fetch(input, {
				...requestInit,
				headers: {
					...requestInit?.headers,
					Authorization: `Bearer ${newSession.accessToken}`,
				},
			})
		},
	})

	return (
		<AuthContext.Provider
			value={{
				isAuth,
				user: session?.user ?? null,
				signUp,
				signIn,
				signOut,
				api,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
