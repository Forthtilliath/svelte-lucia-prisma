import { auth } from '$lib/server/lucia'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { LuciaError } from 'lucia'

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate()
	if (session) {
		throw redirect(302, '/')
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const { name, username, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>
		try {
			await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: username.toLowerCase(),
					password
				},
				attributes: {
					name,
					username
				}
			})
		} catch (err) {
			if (err instanceof LuciaError && err.message === 'AUTH_INVALID_KEY_ID') {
				console.log(err.message)
			}
			if (err instanceof Error) {
				console.error(err.message)
			}
			return fail(400, { message: 'Could not register user' })
		}
		throw redirect(302, '/login')
	}
}
