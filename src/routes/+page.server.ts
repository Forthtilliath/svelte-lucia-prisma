import type { Actions, PageServerLoad } from './$types'
import { prismaClient } from '$lib/server/prisma'
import { error, fail, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async () => {
	return {
		articles: await prismaClient.article.findMany()
	}
}

export const actions: Actions = {
	createArticle: async ({ request, locals }) => {
		const session = await locals.auth.validate()
		if (!session) {
			throw redirect(302, '/')
		}

		const { title, content } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>

		try {
			await prismaClient.article.create({
				data: {
					title,
					content,
					userId: session.user.userId
				}
			})
		} catch (err) {
			console.error(err)
			return fail(500, { message: 'Could not create the article.' })
		}

		return {
			status: 201
		}
	},
	deleteArticle: async ({ url, locals }) => {
		const session = await locals.auth.validate()
		if (!session) {
			throw redirect(302, '/')
		}
		const id = url.searchParams.get('id')
		if (!id) {
			return fail(400, { message: 'Invalid request' })
		}

		try {
			const article = await prismaClient.article.findUniqueOrThrow({
				where: {
					id: Number(id)
				}
			})

			if (article.userId !== session.user.userId) {
				throw error(403, 'Not authorized')
			}

			await prismaClient.article.delete({
				where: {
					id: Number(id)
				}
			})
		} catch (err) {
			console.error(err)
			return fail(500, {
				message: 'Something went wrong deleting your article'
			})
		}

		return {
			status: 200
		}
	}
}
