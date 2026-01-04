import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const forwardedFor = request.headers.get('x-forwarded-for');
        let clientIp = forwardedFor ? forwardedFor.split(',')[0] : null;
        const isLocal = !clientIp || clientIp.includes('127.0.0.1') || clientIp.includes('::1');

        // 1. Try ipapi.co (Preferred HTTPS)
        try {
            let url = 'https://ipapi.co/json/';
            if (!isLocal && clientIp) {
                url = `https://ipapi.co/${clientIp}/json/`;
            }
            console.log('Fetching primary geo:', url);
            const res = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.latitude && data.longitude) {
                    return NextResponse.json(data);
                }
            }
        } catch (e) {
            console.error('Primary geo failed:', e);
        }

        // 2. Fallback to ip-api.com (HTTP, reliable for free tier)
        try {
            // ip-api.com doesn't support HTTPS on free tier, but server-side fetch is fine.
            let url = 'http://ip-api.com/json/';
            if (!isLocal && clientIp) {
                url = `http://ip-api.com/json/${clientIp}`;
            }
            console.log('Fetching fallback geo:', url);
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    // Map fields to match ipapi.co format
                    return NextResponse.json({
                        city: data.city,
                        latitude: data.lat,
                        longitude: data.lon,
                        timezone: data.timezone,
                        country: data.country
                    });
                }
            }
        } catch (e) {
            console.error('Fallback geo failed:', e);
        }

        return NextResponse.json({ error: 'Failed to detect location' }, { status: 500 });
    } catch (error) {
        console.error('Geolocation error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
