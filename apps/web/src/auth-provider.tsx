import { ReactNode, useState } from 'react'

import AuthContext, { ISignInForm, ISignUpForm, TUser } from '@/auth-context'

import api from './lib/api'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<TUser | null>(getCurrentUser())
	const isAuth = !!user

	async function signUp(form: ISignUpForm) {
		await api.auth['sign-up'].$post({ form })
	}

	async function signIn(form: ISignInForm) {
		const res = await api.auth['sign-in'].$post({ form })
		const user = await res.json()
		setUser(user)
		setCurrentUser(user)
	}

	async function signOut() {
		await api.auth['sign-out'].$delete()
		setUser(null)
		setCurrentUser(null)
	}

	return (
		<AuthContext.Provider value={{ isAuth, user, signUp, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

const USER_KEY = 'current-user'

function getCurrentUser() {
	if (typeof window === 'undefined') return null
	const userStr = localStorage.getItem(USER_KEY)
	if (!userStr) return null

	return JSON.parse(userStr) as TUser
}

function setCurrentUser(user: TUser | null) {
	if (typeof window === 'undefined') return

	if (!user) {
		localStorage.removeItem(USER_KEY)
		return
	}

	localStorage.setItem(USER_KEY, JSON.stringify(user))
}
