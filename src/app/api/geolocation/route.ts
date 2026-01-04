import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Try to get IP from headers (works if behind a proxy/Vercel)
        // For localhost, we might just call ipapi directly without IP param to let it detect,
        // but server-side fetch from localhost might look like data center?
        // Actually, if I fetch 'https://ipapi.co/json/' from server, it returns the server's location.
        // On localhost, it returns my ISP location (same as browser).
        // On Vercel, it returns Vercel's AWS location (not the user).

        // BETTER APPROACH for Production:
        // Use headers 'x-forwarded-for' to get user IP, then query ipapi with that IP.

        const forwardedFor = request.headers.get('x-forwarded-for');
        let clientIp = forwardedFor ? forwardedFor.split(',')[0] : null;

        // If testing on localhost, clientIp might be ::1 or 127.0.0.1.
        // In that case, we can't query specific IP, just let ipapi detect the caller (me).
        // But for real users, we need their IP.

        let url = 'https://ipapi.co/json/';
        if (clientIp && !clientIp.includes('127.0.0.1') && !clientIp.includes('::1')) {
            url = `https://ipapi.co/${clientIp}/json/`;
        }

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'MuslimAdhkarWeb/1.0'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch geo data: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Geolocation error:', error);
        // Fallback or error
        return NextResponse.json({ error: 'Failed to detect location' }, { status: 500 });
    }
}
