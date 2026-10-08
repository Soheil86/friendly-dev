import type { Post } from '~/types'
import type { Route } from './+types/index'
import PostCard from '~/components/PostCard'
import { useState } from 'react'
import Pagination from '~/components/Pagination'

export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ posts: Post[] }> {
	const url = new URL('/posts-meta.json', request.url)
	const res = await fetch(url.href)

	if (!res.ok) throw new Error('Failed to fetch data')

	const data = await res.json()

	data.sort(
		(a: Post, b: Post) =>
			new Date(b.date).getTime() - new Date(a.date).getTime(),
	)

	return { posts: data }
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
	const [currentPage, setCurrentPage] = useState(1)
	const postsPerPage = 3
	const indexOfLastPost = currentPage * postsPerPage
	const indexOfFirstPost = indexOfLastPost - postsPerPage
	const currentPosts = loaderData.posts.slice(indexOfFirstPost, indexOfLastPost)
	const totalPages = Math.ceil(loaderData.posts.length / postsPerPage)
	const { posts } = loaderData

	console.log(posts)
	return (
		<div className='max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900'>
			<h2 className='text-3xl text-white font-bold mb-8'>📝 Blog</h2>
			<div className='grid gap-6'>
				{currentPosts.map((post) => (
					<PostCard key={post.slug} post={post} />
				))}
			</div>
			{totalPages > 1 && (
				<div className='mt-8'>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</div>
	)
}

export default BlogPage
