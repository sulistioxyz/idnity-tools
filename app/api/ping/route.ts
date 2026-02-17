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
  let target = searchParams.get('target')?.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();

  if (!target) return NextResponse.json({ error: "Target tidak valid" }, { status: 400 });

  try {
    const start = performance.now();
    // Melakukan fetch singkat untuk mengukur waktu respon
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    await fetch(`http://${target}`, { mode: 'no-cors', signal: controller.signal }).catch(() => {});
    
    clearTimeout(id);
    const end = performance.now();
    const latency = Math.round(end - start);

    userRate.count += 1;
    rateLimitMap.set(visitorIp, userRate);

    return NextResponse.json({ target, latency, status: 'Success' });
  } catch (error) {
    return NextResponse.json({ error: "Gagal melakukan ping ke target" }, { status: 500 });
  }
}