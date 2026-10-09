export function getProjectImageUrl(imageUrl?: string | null): string {
	if (!imageUrl) {
		return '/images/no-image.png'
	}

	return new URL(imageUrl, import.meta.env.VITE_API_URL).href
}
