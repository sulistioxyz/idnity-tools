import { NextResponse } from 'next/server';
import dns from 'node:dns/promises';

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const LIMIT = 3; 
const WINDOW_TIME = 60 * 1000; 

// Konfigurasi Resolver Global untuk pengecekan propagasi
const resolvers = [
  { name: 'Google DNS (Global)', ip: '8.8.8.8', location: 'USA' },
  { name: 'Cloudflare (Global)', ip: '1.1.1.1', location: 'Europe' },
  { name: 'OpenDNS (Global)', ip: '208.67.222.222', location: 'Singapore' },
  { name: 'Quad9 (Global)', ip: '9.9.9.9', location: 'Australia' }
];

export async function GET(request: Request) {
  let visitorIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (visitorIp.includes(',')) visitorIp = visitorIp.split(',')[0].trim();

  const now = Date.now();
  const userRate = rateLimitMap.get(visitorIp) || { count: 0, lastRequest: now };

  if (now - userRate.lastRequest > WINDOW_TIME) {
    userRate.count = 0;
    userRate.lastRequest = now;
  }

  if (userRate.count >= LIMIT) {
    const retryAfter = Math.ceil((userRate.lastRequest + WINDOW_TIME - now) / 1000);
    return NextResponse.json({ error: "Terlalu banyak permintaan.", retryAfter }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain')?.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();

  if (!domain || !domain.includes('.')) {
    return NextResponse.json({ error: "Nama domain tidak valid" }, { status: 400 });
  }

  try {
    // 1. Ambil Record Utama menggunakan teknik Dual-Lookup untuk NS
    const [a, mx, txt, ns, nsAlternative] = await Promise.allSettled([
      dns.resolve(domain, 'A'),
      dns.resolve(domain, 'MX'),
      dns.resolve(domain, 'TXT'),
      dns.resolveNs(domain),      // Metode 1: Khusus NS
      dns.resolve(domain, 'NS'),   // Metode 2: Query standar (Cadangan)
    ]);

    // Gabungkan hasil NS, hilangkan duplikat, dan ubah ke lowercase
    const nsCombined = [];
    if (ns.status === 'fulfilled') nsCombined.push(...ns.value);
    if (nsAlternative.status === 'fulfilled') nsCombined.push(...nsAlternative.value);
    const uniqueNs = Array.from(new Set(nsCombined)).map(n => n.toLowerCase());

    // 2. Simulasi Global Propagation (A Record)
    const propagation = await Promise.all(resolvers.map(async (r) => {
      const resolver = new dns.Resolver();
      resolver.setServers([r.ip]);
      try {
        const result = await resolver.resolve4(domain);
        return { ...r, result: result[0], status: 'OK' };
      } catch {
        return { ...r, result: 'Not Found', status: 'FAIL' };
      }
    }));

    userRate.count += 1;
    rateLimitMap.set(visitorIp, userRate);

    return NextResponse.json({
      domain,
      records: {
        A: a.status === 'fulfilled' ? a.value : [],
        MX: mx.status === 'fulfilled' ? mx.value : [],
        TXT: txt.status === 'fulfilled' ? txt.value.flat() : [],
        NS: uniqueNs, // Hasil gabungan yang lebih akurat
      },
      propagation 
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data DNS" }, { status: 500 });
  }
}