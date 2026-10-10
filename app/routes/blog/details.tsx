import ReactMarkdown from 'react-markdown'
import type { Route } from './+types/details'
import type { Post, StrapiPost, StrapiResponse } from '~/types'
import { Link } from 'react-router'
import { getProjectImageUrl } from '~/utils/getProjectImageUrl'

export async function loader({
	request,
	params,
}: Route.LoaderArgs): Promise<{ post: Post }> {
	const { slug } = params

	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/posts?filters[slug][$eq]=${slug}&populate=*`,
	)

	if (!response.ok) throw new Error('Failed to fetch data')

	const json: StrapiResponse<StrapiPost> = await response.json()

	if (!json.data.length) {
		throw new Response('Post not found', { status: 404 })
	}

	const item = json.data[0]

	const post: Post = {
		id: item.id,
		slug: item.slug,
		excerpt: item.excerpt,
		title: item.title,
		date: item.date,
		body: item.body,
		image: getProjectImageUrl(item.image?.url),
	}

	return { post }
}

export function HydrateFallback() {
	return (
		<div className='text-white text-2xl font-bold'>Loading post details...</div>
	)
}

type BlogPostDetailsPageProps = {
	loaderData: {
		post: Post
	}
}

const BlogPostDetailsPage = ({ loaderData }: BlogPostDetailsPageProps) => {
	const { post } = loaderData

	return (
		<div className='max-w-3xl mx-auto px-6 py-12 bg-gray-900'>
			<h1 className='text-3xl font-bold text-blue-400 mb-2'>{post.title}</h1>
			<p className='text sm text-gray-400 mb-6'>
				{new Date(post.date).toDateString()}
			</p>

			<img
				src={post.image}
				alt={post.title}
				className='w-full h-64 object-cover mb-4 '
			/>

			<div className='prose prose-invert max-w-none mb-12'>
				<ReactMarkdown>{post.body}</ReactMarkdown>
			</div>

			<Link
				to='/blog'
				className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
			>
				← Back To Posts
			</Link>
		</div>
	)
}

export default BlogPostDetailsPage
