'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';

export default function Analytics() {
    useEffect(() => {
        // Accessing the analytics import ensures the module is evaluated on the client
        // and the initialization logic in src/lib/firebase.ts captures the session.
        // If you need to log specific events on mount, you can do it here.
        if (analytics) {
            // Analytics initialized
        }
    }, []);

    return null;
}
