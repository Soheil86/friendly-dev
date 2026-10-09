import type { Post, StrapiPost, StrapiResponse } from '~/types'
import type { Route } from './+types/index'
import PostCard from '~/components/PostCard'
import { useState } from 'react'
import Pagination from '~/components/Pagination'
import PostFilter from '~/components/PostFilter'
import { getProjectImageUrl } from '~/utils/getProjectImageUrl'

export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ posts: Post[] }> {
	const res = await fetch(
		`${import.meta.env.VITE_API_URL}/posts?populate=*&sort=date:desc`,
	)

	if (!res.ok) throw new Error('Failed to fetch data')

	const json: StrapiResponse<StrapiPost> = await res.json()

	const posts = json.data.map((item) => ({
		id: item.id,
		title: item.title,
		excerpt: item.excerpt,
		slug: item.slug,
		date: item.date,
		body: item.body,
		image: getProjectImageUrl(item.image?.url),
	}))

	return {
		posts,
	}
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const postsPerPage = 3

	const { posts } = loaderData

	const filteredPosts = posts.filter((post) => {
		const query = searchQuery.toLowerCase()
		return (
			post.title.toLowerCase().includes(query) ||
			post.excerpt.toLowerCase().includes(query)
		)
	})

	const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
	const indexOfLastPost = currentPage * postsPerPage
	const indexOfFirstPost = indexOfLastPost - postsPerPage
	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

	return (
		<div className='max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900'>
			<h2 className='text-3xl text-white font-bold mb-8'>📝 Blog</h2>
			<PostFilter
				searchQuery={searchQuery}
				onSearchChange={(query) => {
					setSearchQuery(query)
					setCurrentPage(1) // Reset to first page on search
				}}
			/>

			<div className='space-y-8'>
				{currentPosts.length === 0 ? (
					<p className='text-gray-400 text-center'>No posts found</p>
				) : (
					currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
				)}
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
