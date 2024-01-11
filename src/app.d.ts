import type { User } from 'lucia'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest<import('$lib/server/lucia').Auth>
			// user: Omit<Prisma.UserGetPayload<object>, 'id'>
			user: User
		}
		// interface PageData {}
		// interface Platform {}
	}

	declare namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth
		type DatabaseUserAttributes = {
			username: string
			name: string
		}
	}
}

export {}
