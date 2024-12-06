import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	API_PORT: z.coerce.number(),
	DATABASE_URL: z.string().url(),
	CLIENT_ORIGIN: z.string().url(),
	JWT_SECRET: z.string().min(32),
	BETTER_AUTH_SECRET: z.string().min(32),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
	console.error('❌ Invalid environment variables:')
	console.error(parsedEnv.error.flatten().fieldErrors)
	process.exit(1)
}

export default parsedEnv.data
