import FeatureProjects from '~/components/FeaturedProjects'
import type { Route } from './+types/index'
import type {
	Post,
	Project,
	ProjectApiItem,
	StrapiPost,
	StrapiProject,
	StrapiResponse,
} from '~/types'
import AboutPreview from '~/components/AboutPreview'
import LatestPosts from '~/components/LatestPost'
import { getProjectImageUrl } from '~/utils/getProjectImageUrl'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'The Friendly Dev | Welcome' },
		{ name: 'description', content: 'Custom web development and articles on modern JavaScript, React and full-stack development' },
	]
}

export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[]; posts: Post[] }> {
	const url = new URL(request.url)

	const [projectsResponse, postsResponse] = await Promise.all([
		fetch(
			`${import.meta.env.VITE_API_URL}/projects?filters[featured][$eq]=true&populate=*`,
		),
		fetch(`${import.meta.env.VITE_API_URL}/posts?populate=*&sort=date:desc`),
	])

	if (!projectsResponse.ok) {
		throw new Error('Failed to fetch projects')
	}

	if (!postsResponse.ok) {
		throw new Error('Failed to fetch posts')
	}

	const [projectJson, postJson]: [
		StrapiResponse<StrapiProject>,
		StrapiResponse<StrapiPost>,
	] = await Promise.all([projectsResponse.json(), postsResponse.json()])

	const projects = projectJson.data.map((item) => ({
		id: item.id,
		documentId: item.documentId,
		title: item.title,
		description: item.description,
		image: getProjectImageUrl(item.image?.url),
		url: item.url,
		date: item.date,
		category: item.category,
		featured: item.featured,
	}))

	const posts: Post[] = postJson.data.map((item) => ({
		id: item.id,
		title: item.title,
		excerpt: item.excerpt,
		slug: item.slug,
		date: item.date,
		body: item.body,
		image: getProjectImageUrl(item.image?.url),
	}))

	return { projects, posts }
}

const HomePage = ({ loaderData }: Route.ComponentProps) => {
	const { projects, posts } = loaderData

	return (
		<>
			<FeatureProjects projects={projects} count={2} />
			<AboutPreview />
			<LatestPosts posts={posts} limit={3} />
		</>
	)
}

export default HomePage
