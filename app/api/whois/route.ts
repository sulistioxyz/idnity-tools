import { NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const LIMIT = 3; 
const WINDOW_TIME = 60 * 1000; 

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
    const response = await fetch(`https://rdap.org/domain/${domain}`);
    
    if (response.status === 404) {
      return NextResponse.json({ status: 'AVAILABLE', domain });
    }

    const rdapData = await response.json();
    userRate.count += 1;
    rateLimitMap.set(visitorIp, userRate);

    // --- PERBAIKAN LOGIKA REGISTRAR ---
    const registrarEntity = rdapData.entities?.find((e: any) => e.roles.includes('registrar'));
    const vcard = registrarEntity?.vcardArray?.[1] || [];
    // Cari properti 'fn' (Full Name) di dalam vcard
    const registrarName = vcard.find((prop: any) => prop[0] === 'fn')?.[3] || "N/A";

    const events = rdapData.events || [];
    const created = events.find((e: any) => e.eventAction === 'registration')?.eventDate;
    const expiry = events.find((e: any) => e.eventAction === 'expiration')?.eventDate;
    const updated = events.find((e: any) => e.eventAction === 'last changed')?.eventDate;
    
    const status = rdapData.status || [];
    const nameservers = rdapData.nameservers?.map((ns: any) => ns.ldhName.toLowerCase()) || [];

    return NextResponse.json({
      status: 'REGISTERED',
      domain,
      registrar: registrarName, // Sekarang mengambil nama asli, bukan "4.0"
      created,
      expiry,
      updated,
      domainStatus: status.join(', '),
      nameservers: nameservers.join(', ')
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data domain" }, { status: 500 });
  }
}