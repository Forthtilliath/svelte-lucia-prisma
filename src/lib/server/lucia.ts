import { lucia } from 'lucia'
import { prisma } from '@lucia-auth/adapter-prisma'
import { sveltekit } from 'lucia/middleware'
import { dev } from '$app/environment'
import { prismaClient } from '$lib/server/prisma'

export const auth = lucia({
	adapter: prisma(prismaClient),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (userData) => {
		return {
			username: userData.username,
			name: userData.name
		}
	},
	sessionCookie: {
		expires: false
	}
})

export type Auth = typeof auth
