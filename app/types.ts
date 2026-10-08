export type Project = {
	id: number
	title: string
	description: string
	image: string
	url: string
	date: string
	category: string
	featured: boolean
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
