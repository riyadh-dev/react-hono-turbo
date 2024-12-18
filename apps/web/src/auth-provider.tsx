import { ReactNode, useEffect, useState } from 'react'

import AuthContext, {
	TSession,
	TSignInParams,
	TSignOutParams,
	TSignUpParams,
} from './auth-context'
import { authClient } from './lib/auth-client'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isReady, setReady] = useState(false)
	const [session, setSession] = useState<TSession | null>(null)
	const isAuth = !!session

	const signUp = async (params: TSignUpParams) => {
		const { data } = await authClient.signUp.email(params)
		setSession(data)
	}

	const signIn = async (params: TSignInParams) => {
		const { data } = await authClient.signIn.email(params)
		setSession(data)
	}

	const signOut = async (params: TSignOutParams) => {
		await authClient.signOut(params)
		setSession(null)
	}

	const updateSession = () => {
		authClient
			.getSession({ fetchOptions: { onError: () => setSession(null) } })
			.then(({ data }) => setSession(data))
			.catch(() => setSession(null))
			.finally(() => setReady(true))
	}

	useEffect(() => {
		updateSession()
	}, [])

	useEffect(() => {
		if (!session) return

		const currentTime = new Date().getTime()
		const expireTime = session.session.expiresAt.getTime()
		const remainingTime = expireTime - currentTime
		if (remainingTime < 0) {
			setSession(null)
			return
		}

		const delay = remainingTime - 1000 * 60 * 60
		if (delay < 0) {
			updateSession()
			return
		}

		const timeout = setTimeout(() => {
			updateSession()
		}, delay)

		return () => {
			clearTimeout(timeout)
		}
	}, [session])

	return (
		<AuthContext.Provider
			value={{
				isReady,
				isAuth,
				session,
				signUp,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
