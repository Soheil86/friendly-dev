export type Project = {
	id: number
	documentId: string
	title: string
	description: string
	image: string
	url: string
	date: string
	category: string
	featured: boolean
}

export type StrapiResponse<T> = {
	data: T[]
}

export type StrapiProject = {
	id: number
	documentId: string
	title: string
	description: string
	image?: {
		url: string
		formats?: {
			thumbnail?: { url: string }
			small?: { url: string }
			medium?: { url: string }
			large?: { url: string }
		}
	}
	url: string
	date: string
	category: string
	featured: boolean
}

export type ProjectApiItem = Omit<Project, 'image'> & {
	documentId?: string
	image?: { url?: string | null } | null
}

export type Post = {
	id: string
	slug: string
	title: string
	body: string
	excerpt: string
	date: string
	image: string
}

export type StrapiPost = {
	id: string
	documentId: string
	title: string
	slug: string
	excerpt: string
	date: string
	body: string
	image?: {
		url: string
		formats?: {
			thumbnail?: { url: string }
			small?: { url: string }
			medium?: { url: string }
			large?: { url: string }
		}
	}
}
