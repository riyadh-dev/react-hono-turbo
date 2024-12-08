import { ReactNode, useEffect, useState } from 'react'

import AuthContext, { ICredentials, TSession } from './auth-context'
import { authClient } from './lib/auth-client'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isReady, setReady] = useState(false)
	const [session, setSession] = useState<TSession | null>(null)
	const isAuth = !!session

	const logout = async () => {
		await authClient.signOut()
		setSession(null)
	}

	const login = async (credentials: ICredentials) => {
		const { data } = await authClient.signIn.email(credentials)
		setSession(data)
	}

	useEffect(() => {
		authClient
			.getSession()
			.then(({ data }) => setSession(data))
			.catch(() => setSession(null))
			.finally(() => setReady(true))
	}, [])

	return (
		<AuthContext.Provider
			value={{ isReady, isAuth, session, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	)
}
