import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	API_PORT: z.coerce.number(),
	DATABASE_URL: z.string().url(),
	CLIENT_ORIGINS: z
		.string()
		.transform((origins) => origins.split(','))
		.pipe(z.array(z.string().url()).min(1)),
	JWT_SECRET: z.string().min(32),
	COOKIE_SECRET: z.string().min(32),
	SESSION_EXP: z.coerce.number().int().min(1),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
	console.error('❌ Invalid environment variables:')
	console.error(parsedEnv.error.flatten().fieldErrors)
	process.exit(1)
}

export default parsedEnv.data
