import { createContext, useContext } from 'react'

import { authClient } from './lib/auth-client'

export interface ICredentials {
	email: string
	password: string
}

export type TSession = (typeof authClient.$Infer)['Session']

export interface IAuthContext {
	isAuth: boolean
	session: (typeof authClient.$Infer)['Session'] | null
	login: (credentials: ICredentials) => Promise<void>
	logout: () => Promise<void>
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
