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
  let target = searchParams.get('url')?.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();

  if (!target) return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://${target}`, { 
      method: 'HEAD', 
      signal: controller.signal,
      headers: { 'User-Agent': 'IDnity-Status-Checker/1.0' }
    });
    
    clearTimeout(timeoutId);

    userRate.count += 1;
    rateLimitMap.set(visitorIp, userRate);

    return NextResponse.json({ 
      online: res.ok, 
      status: res.status,
      target 
    });
  } catch (error) {
    return NextResponse.json({ online: false, target });
  }
}