import Link from 'next/link';

interface Item {
    id: string;
    title: string;
    text: string;
    link: string;
}

interface AdhkarGroup {
    pageTitle: string;
    pageSlug: string;
    items: Item[];
}

interface RelatedAdhkarProps {
    related: AdhkarGroup[];
}

export default function RelatedAdhkar({ related }: RelatedAdhkarProps) {
    if (!related || related.length === 0) return null;

    return (
        <div className="mt-12 p-6 rounded-2xl bg-secondary/30 border border-border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📿</span> Related Adhkar & Duas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map((group, idx) => (
                    <div key={idx} className="bg-card rounded-lg p-4 border border-border/50">
                        <Link href={`/adhkar/${group.pageSlug}`} className="text-sm font-medium text-primary hover:underline mb-2 block">
                            {group.pageTitle}
                        </Link>
                        <ul className="space-y-2">
                            {group.items.slice(0, 3).map(item => (
                                <li key={item.id}>
                                    <Link href={item.link} className="block group">
                                        <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                            {item.title}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-1 opacity-75">
                                            {item.text}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                            {group.items.length > 3 && (
                                <li className="text-xs text-muted-foreground pt-1">
                                    + {group.items.length - 3} more...
                                </li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
