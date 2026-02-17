'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Loader2, Activity, ShieldAlert, Timer, Info, Zap, Check, AlertCircle, Signal, Wifi, ZapOff } from 'lucide-react';

export default function PingPage() {
  const [target, setTarget] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [year, setYear] = useState<number | null>(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear());
    const storedExpiry = localStorage.getItem('ping_limit_expiry');
    if (storedExpiry) {
      const timeLeft = Math.round((parseInt(storedExpiry) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setCountdown(timeLeft);
        setData({ error: "Terlalu banyak permintaan." });
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && localStorage.getItem('ping_limit_expiry')) {
      localStorage.removeItem('ping_limit_expiry');
      window.location.reload();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePing = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (countdown > 0) return;
    if (!target.trim()) { setValidationError('Masukkan target (Domain/IP).'); return; }

    setLoading(true);
    setData(null);
    setValidationError('');

    try {
      const res = await fetch(`/api/ping?target=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          localStorage.setItem('ping_limit_expiry', (Date.now() + (json.retryAfter * 1000)).toString());
          setCountdown(json.retryAfter);
        }
        setData({ error: json.error });
      } else {
        setData(json);
      }
    } catch (err) {
      setData({ error: "Gagal menghubungi server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="sticky top-0 z-100 flex h-20 items-center border-b border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 md:gap-3 md:px-6">
          <button onClick={() => window.location.reload()} className="relative h-7 w-26 transition-opacity hover:opacity-80 outline-none">
            <Image src="/images/logo.png" alt="IDnity Logo" fill className="object-contain object-left" priority />
          </button>
          <span className="text-xl font-light text-slate-300">|</span>
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">Ping Tool</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="mb-6 w-full">
            <div className={`rounded-xl border bg-white p-6 shadow-sm transition-colors ${validationError ? 'border-red-300' : 'border-slate-200'}`}>
                <label className="mb-3 block text-sm font-medium text-slate-600 md:text-base tracking-tight">Target to Ping</label>
                <form onSubmit={handlePing} className="flex flex-col gap-3 sm:flex-row">
                    <div className="grow">
                        <input 
                            type="text" placeholder="idnity.com atau 103.xxx.xxx.xxx"
                            className={`w-full rounded-lg border px-4 py-3 text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500 ${validationError ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500'}`}
                            value={target}
                            onChange={(e) => { setTarget(e.target.value); if (e.target.value) setValidationError(''); }}
                        />
                        {validationError && <div className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600"><AlertCircle size={14} /> {validationError}</div>}
                    </div>
                    <button type="submit" disabled={loading || countdown > 0} className="flex h-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70 shadow-sm">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Signal size={20} />} 
                        {countdown > 0 ? `Wait ${countdown}s` : 'Test Ping'}
                    </button>
                </form>
            </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900"><Info size={18} className="text-blue-500" /> How it works</h3>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">1</div> Masukkan domain atau IP target.</li>
                        <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">2</div> Sistem mengukur waktu respon (latensi) dalam milidetik (ms).</li>
                    </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-sm">
                    <Zap className="mb-3 opacity-50" size={24} />
                    <h4 className="font-bold uppercase tracking-tighter">Did you know?</h4>
                    <p className="mt-1 text-sm leading-relaxed opacity-90">Semakin rendah nilai milidetik (ms), semakin cepat koneksi server tersebut. Latensi di bawah 100ms dianggap sangat baik untuk akses website.</p>
                </div>
            </div>

            <div className="lg:col-span-7">
                <div className="flex h-full min-h-125 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="mx-auto h-32 w-32 rounded-full bg-slate-50" />
                            <div className="h-8 w-48 bg-slate-50 rounded mx-auto" />
                        </div>
                    ) : data?.latency ? (
                        <>
                            <div className={`mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full shadow-inner ${data.latency < 200 ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                                <Wifi size={64} strokeWidth={1.5} />
                            </div>
                            <h2 className={`text-5xl font-black tracking-tight ${data.latency < 200 ? 'text-green-600' : 'text-orange-600'}`}>
                                {data.latency} <span className="text-xl">ms</span>
                            </h2>
                            <p className="mt-2 text-lg font-medium text-slate-500">Response time for <strong>{data.target}</strong>.</p>
                        </>
                    ) : data?.error ? (
                        <div className="p-10">
                            <ZapOff size={64} className="mx-auto mb-4 text-red-400 opacity-50" />
                            <p className="font-bold text-red-500">{data.error}</p>
                            {countdown > 0 && <p className="mt-2 text-sm text-slate-400">Silakan tunggu {countdown} detik.</p>}
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 text-slate-200"><Activity size={80} strokeWidth={1} /></div>
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Ping Ready</h2>
                            <p className="mt-2 max-w-sm text-slate-500">Uji kecepatan server Anda sekarang.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          <p>&copy; {year || '2026'} <strong>IDnity Tools</strong>. Part of IDnity Ecosystem.</p>
      </footer>
    </div>
  );
}