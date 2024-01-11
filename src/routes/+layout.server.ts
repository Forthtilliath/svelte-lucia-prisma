import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	// Boucle infinie quand on est pas connecté
	// if (!locals.user) throw redirect(302, '/login');
	return {
		user: locals.user
	}
}
