import { NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const LIMIT = 3; 
const WINDOW_TIME = 60 * 1000; 

export async function GET(request: Request) {
  let visitorIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  if (visitorIp.includes(',')) {
    visitorIp = visitorIp.split(',')[0].trim();
  }

  const now = Date.now();
  const userRate = rateLimitMap.get(visitorIp) || { count: 0, lastRequest: now };

  if (now - userRate.lastRequest > WINDOW_TIME) {
    userRate.count = 0;
    userRate.lastRequest = now;
  }

  if (userRate.count >= LIMIT) {
    // Hitung sisa detik secara akurat
    const retryAfter = Math.ceil((userRate.lastRequest + WINDOW_TIME - now) / 1000);
    return NextResponse.json(
      { 
        error: "Terlalu banyak permintaan. Silakan coba lagi nanti.", 
        retryAfter: retryAfter // Kirim sisa detik ke frontend
      },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const queryIp = searchParams.get('ip');
  let ipToLookup = queryIp;

  if (!ipToLookup) {
    const isLocalhost = visitorIp === '::1' || visitorIp === '127.0.0.1' || !visitorIp;
    ipToLookup = isLocalhost ? '8.8.8.8' : visitorIp;
  }

  try {
    const geoResponse = await fetch(
      `http://ip-api.com/json/${ipToLookup}?fields=status,message,query,country,regionName,city,lat,lon,timezone,isp,org,as`
    );
    const geoData = await geoResponse.json();

    if (geoData.status === 'fail') {
      return NextResponse.json({ error: "IP yang dimasukan tidak Valid", ip: ipToLookup }, { status: 400 });
    }

    userRate.count += 1;
    rateLimitMap.set(visitorIp, userRate);

    return NextResponse.json({
      ip: geoData.query,
      city: geoData.city || '-',
      region: geoData.regionName || '-',
      country: geoData.country || '-',
      isp: geoData.isp || '-',
      asn: geoData.as || '-',
      timezone: geoData.timezone || '-',
      lat: geoData.lat,
      lon: geoData.lon,
      org: geoData.org
    });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data lokasi', ip: ipToLookup }, { status: 500 });
  }
}