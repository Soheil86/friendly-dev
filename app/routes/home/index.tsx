import FeatureProjects from '~/components/FeaturedProjects'
import type { Route } from './+types/index'
import type { Post, Project } from '~/types'
import AboutPreview from '~/components/AboutPreview'
import LatestPosts from '~/components/LatestPost'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'The Friendly Dev | Welcome' },
		{ name: 'description', content: 'Custome website development' },
	]
}

export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[]; posts: Post[] }> {
	const url = new URL(request.url)

	const [projectsResponse, postsResponse] = await Promise.all([
		fetch(`${import.meta.env.VITE_API_URL}/projects`),
		fetch(new URL('/posts-meta.json', url)),
	])

	if (!projectsResponse.ok) {
		throw new Error('Failed to fetch projects')
	}

	if (!postsResponse.ok) {
		throw new Error('Failed to fetch posts')
	}

	const [projectsData, postsData] = await Promise.all([
		projectsResponse.json(),
		postsResponse.json(),
	])

	return { projects: projectsData, posts: postsData }
}

const HomePage = ({ loaderData }: Route.ComponentProps) => {
	const { projects, posts } = loaderData

	console.log('HomePage loaderData:', loaderData) // Debugging line

	return (
		<>
			<FeatureProjects projects={projects} count={2} />
			<AboutPreview />
			<LatestPosts posts={posts} limit={3} />
		</>
	)
}

export default HomePage
