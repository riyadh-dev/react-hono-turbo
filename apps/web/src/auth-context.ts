import { createContext, useContext } from 'react'

import { authClient } from './lib/auth-client'

export type TSignUpParams = Parameters<typeof authClient.signUp.email>[0]
export type TSignInParams = Parameters<typeof authClient.signIn.email>[0]
export type TSignOutParams = Parameters<typeof authClient.signOut>[0]

export type TSession = (typeof authClient.$Infer)['Session']

export interface IAuthContext {
	isReady: boolean
	isAuth: boolean
	session: (typeof authClient.$Infer)['Session'] | null
	signUp: (params: TSignUpParams) => Promise<void>
	signIn: (params: TSignInParams) => Promise<void>
	signOut: (params?: TSignOutParams) => Promise<void>
}

const AuthContext = createContext<IAuthContext | null>(null)

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export default AuthContext
