import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://muslimadhkar.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/api/'],
        },
        sitemap: [
            `${baseUrl}/sitemap.xml`,
            `${baseUrl}/sitemap-quran.xml`,
        ],
    }
}
