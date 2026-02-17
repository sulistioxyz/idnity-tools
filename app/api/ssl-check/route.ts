import { NextResponse } from 'next/server';
import tls from 'tls';

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
    // HITUNG RETRY AFTER SECARA AKURAT
    const retryAfter = Math.ceil((userRate.lastRequest + WINDOW_TIME - now) / 1000);
    return NextResponse.json({ 
      error: "Terlalu banyak permintaan. Silakan coba lagi nanti.", 
      retryAfter 
    }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const rawDomain = searchParams.get('domain') || '';
  const domain = rawDomain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

  if (!domain || domain.length < 3) {
    return NextResponse.json({ error: "Nama domain tidak valid" }, { status: 400 });
  }

  return new Promise((resolve) => {
    const socket = tls.connect(443, domain, { servername: domain, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();

      if (!cert || Object.keys(cert).length === 0) {
        resolve(NextResponse.json({ error: "Sertifikat SSL tidak ditemukan" }, { status: 400 }));
        return;
      }

      userRate.count += 1;
      rateLimitMap.set(visitorIp, userRate);

      resolve(NextResponse.json({
        subject: cert.subject?.CN || domain,
        issuer: cert.issuer?.O || cert.issuer?.CN || "Unknown Issuer",
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        remainingDays: Math.ceil((new Date(cert.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      }));
    });

    socket.setTimeout(10000);
    socket.on('timeout', () => { socket.destroy(); resolve(NextResponse.json({ error: "Waktu koneksi habis (Timeout)" }, { status: 408 })); });
    socket.on('error', () => { socket.destroy(); resolve(NextResponse.json({ error: "Gagal terhubung ke domain." }, { status: 400 })); });
  });
}