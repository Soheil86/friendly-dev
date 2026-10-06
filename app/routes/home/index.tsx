import type { Route } from './+types/index'

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'The Friendly Dev | Welcome' },
		{ name: 'description', content: 'Custome website development' },
	]
}

export default function Home() {
	return <>Home Page</>
}
