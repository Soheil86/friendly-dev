import type { Project } from '~/types'
import type { Route } from './+types/index'
import ProjectCard from '~/components/ProjectCard'
import { useState } from 'react'
import Pagination from '~/components/Pagination'

export async function loader({
	request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
	const response = await fetch('http://localhost:8000/projects')
	const data = await response.json()

	return { projects: data }
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
	const { projects } = loaderData as { projects: Project[] }

	const [currentPage, setCurrentPage] = useState(1)
	const projectsPerPage = 4

	const indexOfLastProject = currentPage * projectsPerPage
	const indexOfFirstProject = indexOfLastProject - projectsPerPage
	const currentProjects = projects.slice(
		indexOfFirstProject,
		indexOfLastProject,
	)

	const totalPages = Math.ceil(projects.length / projectsPerPage)

	return (
		<>
			<h2 className='text-3xl text-white font-bold mb-8'>🚀 Projects</h2>

			<div className='grid gap-6 sm:grid-cols-2'>
				{currentProjects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</>
	)
}

export default ProjectsPage
