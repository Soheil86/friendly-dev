import type {
	Project,
	ProjectApiItem,
	StrapiProject,
	StrapiResponse,
} from '~/types'
import type { Route } from './+types/index'
import ProjectCard from '~/components/ProjectCard'
import { useState } from 'react'
import Pagination from '~/components/Pagination'
import { AnimatePresence, motion } from 'framer-motion'
import { getProjectImageUrl } from '~/utils/getProjectImageUrl'

export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/projects?populate=*`,
	)
	const json: StrapiResponse<StrapiProject> = await response.json()

	const projects = json.data.map((item) => ({
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
	return { projects }
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
	const [selectedCategory, setSelectedCategory] = useState('All')
	const [currentPage, setCurrentPage] = useState(1)
	const projectsPerPage = 6
	const { projects } = loaderData as { projects: Project[] }

	// Get unique categories
	const categories = [
		'All',
		...new Set(projects.map((project) => project.category)),
	]

	// Filter projects based on selected category
	const filteredProjects =
		selectedCategory === 'All'
			? projects
			: projects.filter((project) => project.category === selectedCategory)

	// Pagination logic

	const indexOfLastProject = currentPage * projectsPerPage
	const indexOfFirstProject = indexOfLastProject - projectsPerPage
	const currentProjects = filteredProjects.slice(
		indexOfFirstProject,
		indexOfLastProject,
	)

	const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

	return (
		<>
			<h2 className='text-3xl text-white font-bold mb-8'>🚀 Projects</h2>

			<div className='flex flex-wrap gap-2 mb-8'>
				{categories.map((category) => (
					<button
						key={category}
						onClick={() => {
							setSelectedCategory(category)
							setCurrentPage(1)
						}}
						className={`px-3 py-1 rounded text-sm cursor-pointer ${
							selectedCategory === category
								? 'bg-blue-600 text-white'
								: 'bg-gray-700 text-gray-200'
						}`}
					>
						{category}
					</button>
				))}
			</div>

			<AnimatePresence mode='wait'>
				<motion.div layout className='grid gap-6 sm:grid-cols-2'>
					{currentProjects.map((project) => (
						<motion.div key={project.id} layout>
							<ProjectCard project={project} />
						</motion.div>
					))}
				</motion.div>
			</AnimatePresence>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</>
	)
}

export default ProjectsPage
