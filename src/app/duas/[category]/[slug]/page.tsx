export default async function DuaPage({ params }: { params: Promise<{ category: string, slug: string }> }) {
    const { category, slug } = await params;
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold capitalize">{slug.replace('-', ' ')}</h1>
            <p className="text-gray-600 mb-4">Category: {category}</p>
            <p>Content for this Dua will appear here.</p>
        </div>
    );
}

export async function generateStaticParams() {
    return [
        { category: 'daily', slug: 'waking-up' },
    ];
}
