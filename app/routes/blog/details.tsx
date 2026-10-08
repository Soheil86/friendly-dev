import ReactMarkdown from 'react-markdown'
import type { Route } from './+types/details'
import type { Post } from '~/types'
import { div } from 'framer-motion/m'
import { Link } from 'react-router'

// Every markdown file in app/posts, as raw text, keyed by file path
const markdownFiles = import.meta.glob<string>('../../posts/*.md', {
	query: '?raw',
	import: 'default',
})

export async function loader({
	request,
	params,
}: Route.LoaderArgs): Promise<{ post: Post; markdown: string }> {
	const { slug } = params

	const url = new URL('/posts-meta.json', request.url)
	const response = await fetch(url.href)
	if (!response.ok) throw new Error('Failed to fetch data')

	const posts: Post[] = await response.json()
	const post = posts.find((post) => post.slug === slug)
	const loadMarkdown = markdownFiles[`../../posts/${slug}.md`]

	if (!post || !loadMarkdown) {
		throw new Response('Post not found', { status: 404 })
	}

	const markdown = await loadMarkdown()

	return { post, markdown }
}

export function HydrateFallback() {
	return (
		<div className='text-white text-2xl font-bold'>Loading post details...</div>
	)
}

const BlogDetailsPage = ({ loaderData }: Route.ComponentProps) => {
	const { post, markdown } = loaderData
	const { title, date } = post

	return (
		<div className='max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900'>
			<h1 className='text-3xl text-white font-bold mb-4'>{title}</h1>
			<p className='text-gray-400 mb-6'>{new Date(date).toDateString()}</p>
			<div className='prose prose-invert max-w-none mb-12'>
				<ReactMarkdown>{markdown}</ReactMarkdown>
			</div>

			<Link
				to='/blog'
				className='inline-block mt-6 text-blue-400 hover:text-blue-500 transition'
			>
				← Back to Blog
			</Link>
		</div>
	)
}

export default BlogDetailsPage
