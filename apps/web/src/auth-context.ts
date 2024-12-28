import { Client } from 'api/hc'
import { createContext, useContext } from 'react'

export interface ISignUpForm {
	username: string
	email: string
	password: string
}

export interface ISignInForm {
	email: string
	password: string
}

export type TSession = Awaited<
	ReturnType<
		Awaited<ReturnType<Client['api']['auth']['sign-in']['$post']>>['json']
	>
>

export interface IAuthContext {
	isAuth: boolean
	user: TSession['user'] | null
	signUp: (form: ISignUpForm) => Promise<void>
	signIn: (form: ISignInForm) => Promise<void>
	signOut: () => Promise<void>
	api: Client['api']
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
