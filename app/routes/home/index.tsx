import FeatureProjects from '~/components/FeaturedProjects'
import type { Route } from './+types/index'
import type { Project } from '~/types'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'The Friendly Dev | Welcome' },
		{ name: 'description', content: 'Custome website development' },
	]
}

export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
	const result = await fetch(`${import.meta.env.VITE_API_URL}/projects`)
	const data = await result.json()

	return { projects: data }
}

const HomePage = ({ loaderData }: Route.ComponentProps) => {
	const { projects } = loaderData

	return (
		<>
			<FeatureProjects projects={projects} count={2} />
		</>
	)
}

export default HomePage
