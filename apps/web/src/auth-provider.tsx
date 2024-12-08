import { ReactNode, useEffect, useState } from 'react'

import AuthContext, { ICredentials, TSession } from './auth-context'
import { authClient } from './lib/auth-client'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setUser] = useState<TSession | null>(getStoredSession())
	const isAuth = !!session

	const logout = async () => {
		await authClient.signOut()
		setStoredSession(null)
		setUser(null)
	}

	const login = async (credentials: ICredentials) => {
		const { data: session } = await authClient.signIn.email(credentials)
		setStoredSession(session)
		setUser(session)
	}

	useEffect(() => {
		setUser(getStoredSession())
	}, [])

	return (
		<AuthContext.Provider value={{ isAuth, session, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

const KEY = 'react-hono-turbo.auth'

function getStoredSession() {
	const sessionString = localStorage.getItem(KEY)
	return sessionString ? (JSON.parse(sessionString) as TSession) : null
}

function setStoredSession(session: TSession | null) {
	if (session) {
		const sessionString = JSON.stringify(session)
		localStorage.setItem(KEY, sessionString)
	} else {
		localStorage.removeItem(KEY)
	}
}
