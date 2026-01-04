import { Metadata } from 'next';

const siteConfig = {
    name: 'Muslim Adhkar',
    nameAr: 'مسلم أذكار',
    description: 'Comprehensive collection of authentic Adhkar, Duas, and Islamic sources.',
    descriptionAr: 'مجموعة شاملة من الأذكار والأدعية الصحيحة من الكتاب والسنة.',
    url: 'https://muslimadhkar.com',
    ogImage: 'https://muslimadhkar.com/og-image.jpg',
    twitterHandle: '@muslimadhkar'
};

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    lang?: 'en' | 'ar';
}

export function constructMetadata({
    title,
    description,
    image,
    path = '',
    lang = 'en'
}: SEOProps = {}): Metadata {

    const isAr = lang === 'ar';
    const siteName = isAr ? siteConfig.nameAr : siteConfig.name;
    const defaultTitle = isAr ? 'أذكار وأدعية يومية' : 'Daily Adhkar & Duas';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - ${defaultTitle}`;

    // For 'template' usage in layout, we might want to return just the template string?
    // But Next.js metadata templating works best when root provides 'template' and children provide 'absolute' or relative.
    // However, here we implementing a builder that returns a *complete* object usually.
    // Let's allow overriding.

    const finalDescription = description || (isAr ? siteConfig.descriptionAr : siteConfig.description);
    const finalImage = image ? [image] : [siteConfig.ogImage];

    return {
        title: title ? {
            default: fullTitle,
            template: `%s | ${siteName}` // Fallback template if needed
        } : fullTitle,
        description: finalDescription,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            // In a real app we'd map specialized localized URLs, but here we assume query params or handled by middleware?
            // Since we use ?lang=, canonical might be the base path.
            canonical: path,
        },
        openGraph: {
            title: fullTitle,
            description: finalDescription,
            url: path,
            siteName: siteName,
            images: finalImage.map(url => ({
                url,
                width: 1200,
                height: 630,
                alt: fullTitle,
            })),
            type: 'website',
            locale: isAr ? 'ar_SA' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description: finalDescription,
            images: finalImage,
            creator: siteConfig.twitterHandle,
        },
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        // We can add other standard tags here
    };
}
