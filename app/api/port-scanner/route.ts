import { NextResponse } from 'next/server';
import net from 'net';

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const LIMIT = 3; 
const WINDOW_TIME = 60 * 1000; 

// Daftar port umum untuk dicek
const COMMON_PORTS = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 25, service: 'SMTP' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 3306, service: 'MySQL' },
  { port: 8080, service: 'HTTP-Alt' }
];

async function checkPort(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000); // Timeout 2 detik

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

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
  const target = searchParams.get('target')?.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();

  if (!target) {
    return NextResponse.json({ error: "Target (IP/Domain) tidak valid" }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      COMMON_PORTS.map(async (p) => {
        const isOpen = await checkPort(target, p.port);
        return { ...p, status: isOpen ? 'Open' : 'Closed' };
      })
    );

    userRate.count += 1;
    rateLimitMap.set(visitorIp, userRate);

    return NextResponse.json({ target, results });
  } catch (error) {
    return NextResponse.json({ error: "Gagal melakukan pemindaian port" }, { status: 500 });
  }
}