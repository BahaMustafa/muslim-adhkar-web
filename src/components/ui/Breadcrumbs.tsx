import Link from 'next/link';
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
                Home
            </Link>
            {items.map((item, index) => (
                <React.Fragment key={item.href}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-gray-400"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                    {index === items.length - 1 ? (
                        <span className="font-medium text-gray-900 dark:text-gray-100" aria-current="page">
                            {item.label}
                        </span>
                    ) : (
                        <Link href={item.href} className="hover:text-emerald-600 transition-colors">
                            {item.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};
