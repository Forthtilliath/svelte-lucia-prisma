import { auth } from '$lib/server/lucia'
import { type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event)

	const session = await event.locals.auth.validate()
	if (session) {
		event.locals.user = session.user
	}
	// if (event.route.id?.startsWith('/(protected)')) {
	// 	if (!user) throw redirect(302, '/auth/sign-in')
	// 	if (!user.verified) throw redirect(302, '/auth/verify/email')
	// }

	return await resolve(event)
}
