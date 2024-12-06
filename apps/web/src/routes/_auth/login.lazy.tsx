import { authClient } from '@/lib/auth-client'
import { useZodForm } from '@/lib/utils'
import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

export const Route = createLazyFileRoute('/_auth/login')({
  component: LoginPage,
})

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginPage() {
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()

  const form = useZodForm({ schema })

  const onSubmit = form.handleSubmit(async (values) => {
    setIsError(false)

    await authClient.signIn.email(
      {
        ...values,
      },
      {
        onRequest: () => setIsPending(true),
        onError() {
          setIsError(true)
          setIsPending(false)
        },
        async onSuccess() {
          setIsPending(false)
          await navigate({ to: '/', replace: true })
        },
      },
    )
  })

  return (
    <div className="flex h-svh flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                required
                type="email"
                autoComplete="email"
                aria-describedby="email-error"
                {...form.register('email')}
                disabled={isPending}
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg disabled:bg-gray-50 disabled:text-gray-500"
              />
              <div className="pt-1 text-red-700" id="email-error">
                {form.formState.errors.email?.message}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-describedby="password-error"
                {...form.register('password')}
                disabled={isPending}
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg disabled:bg-gray-50 disabled:text-gray-500"
              />

              <div className="pt-1 text-red-700" id="password-error">
                {form.formState.errors.password?.message}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          >
            Log in
          </button>

          <div className="text-center text-red-700">
            {isError && 'Invalid email or password'}
          </div>

          <div className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/join" className="text-blue-500 underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
