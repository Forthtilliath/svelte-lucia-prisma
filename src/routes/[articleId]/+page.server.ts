import type { Actions, PageServerLoad } from './$types'
import { prismaClient } from '$lib/server/prisma'
import { error, fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized')
	}

	const getArticle = async () => {
		const article = await prismaClient.article.findUnique({
			where: {
				id: Number(params.articleId)
			}
		})
		if (!article) {
			throw error(404, 'Article not found')
		}
		if (article.userId !== locals.user.userId) {
			throw error(403, 'Unauthorized')
		}

		return article
	}

	return {
		article: await getArticle()
	}
}

export const actions: Actions = {
	updateArticle: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized')
		}

		const { title, content } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>

		try {
			const article = await prismaClient.article.findUniqueOrThrow({
				where: {
					id: Number(params.articleId)
				}
			})

			if (article.userId !== locals.user.userId) {
				throw error(403, 'Forbidden to edit this article.')
			}
			await prismaClient.article.update({
				where: {
					id: Number(params.articleId)
				},
				data: {
					title,
					content
				}
			})
		} catch (err) {
			console.error(err)
			return fail(500, { message: 'Could not update article' })
		}

		return {
			status: 200
		}
	}
}
