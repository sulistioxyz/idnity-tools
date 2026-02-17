'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Loader2, Globe, ShieldAlert, Timer, Info, Zap, CheckCircle2, XCircle, AlertCircle, MonitorCheck } from 'lucide-react';

export default function WebsiteOnlinePage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [year, setYear] = useState<number | null>(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear());
    const storedExpiry = localStorage.getItem('online_limit_expiry');
    if (storedExpiry) {
      const timeLeft = Math.round((parseInt(storedExpiry) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setCountdown(timeLeft);
        setData({ error: "Terlalu banyak permintaan. Coba lagi nanti." });
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && localStorage.getItem('online_limit_expiry')) {
      localStorage.removeItem('online_limit_expiry');
      window.location.reload();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const checkStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (countdown > 0) return;
    if (!url.trim()) { setValidationError('Silakan masukkan URL website.'); return; }

    setLoading(true);
    setData(null);
    setValidationError('');

    try {
      const res = await fetch(`/api/is-website-online?url=${encodeURIComponent(url.trim())}`);
      const json = await res.json();
      
      if (!res.ok && res.status === 429) {
          localStorage.setItem('online_limit_expiry', (Date.now() + (json.retryAfter * 1000)).toString());
          setCountdown(json.retryAfter);
          setData({ error: json.error });
      } else {
        setData(json);
      }
    } catch (err) {
      setData({ error: "Gagal mengecek status website." });
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
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">Is Website Online?</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="mb-6 w-full">
            <div className={`rounded-xl border bg-white p-6 shadow-sm transition-colors ${validationError ? 'border-red-300' : 'border-slate-200'}`}>
                {/* Label Camel Case */}
                <label className="mb-3 block text-sm font-medium text-slate-600 md:text-base tracking-tight">Target Website</label>
                <form onSubmit={checkStatus} className="flex flex-col gap-3 sm:flex-row">
                    <div className="grow">
                        <input 
                            type="text" placeholder="google.com atau idnity.com"
                            className={`w-full rounded-lg border px-4 py-3 text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500 ${validationError ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500'}`}
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); if (e.target.value) setValidationError(''); }}
                        />
                        {validationError && <div className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600"><AlertCircle size={14} /> {validationError}</div>}
                    </div>
                    <button type="submit" disabled={loading || countdown > 0} className="flex h-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70 shadow-sm">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />} 
                        {countdown > 0 ? `Wait ${countdown}s` : 'Check Status'}
                    </button>
                </form>
            </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900"><Info size={18} className="text-blue-500" /> How it works</h3>
                    <ul className="space-y-4 text-sm text-slate-600">
                        <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">1</div> Masukkan URL website tanpa http/https.</li>
                        <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">2</div> Sistem akan mencoba menghubungi server website tersebut secara real-time.</li>
                        <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">3</div> Dapatkan konfirmasi apakah website dapat diakses publik atau tidak.</li>
                    </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-sm">
                    <Zap className="mb-3 opacity-50" size={24} />
                    <h4 className="font-bold uppercase tracking-tighter">Did you know?</h4>
                    <p className="mt-1 text-sm leading-relaxed opacity-90">Terkadang website terlihat mati di perangkat Anda tapi sebenarnya online bagi orang lain karena masalah *cache* browser atau koneksi lokal.</p>
                </div>
            </div>

            <div className="lg:col-span-7">
                <div className="flex h-full min-h-125 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="mx-auto h-32 w-32 rounded-full bg-slate-50" />
                            <div className="h-8 w-48 bg-slate-50 rounded mx-auto" />
                        </div>
                    ) : data?.target ? (
                        <>
                            <div className={`mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full shadow-inner ${data.online ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                {data.online ? <CheckCircle2 size={80} strokeWidth={1.5} /> : <XCircle size={80} strokeWidth={1.5} />}
                            </div>
                            <h2 className={`text-4xl font-black uppercase tracking-tight ${data.online ? 'text-green-600' : 'text-red-600'}`}>
                                Website {data.online ? 'Online' : 'Offline'}
                            </h2>
                            <p className="mt-2 text-lg font-medium text-slate-500">
                                {data.online 
                                    ? `Bagus! ${data.target} dapat diakses dengan normal.` 
                                    : `Maaf, ${data.target} tidak merespon atau sedang mengalami gangguan.`}
                            </p>
                            {data.status && (
                                <span className="mt-4 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-400">HTTP Status: {data.status}</span>
                            )}
                        </>
                    ) : data?.error ? (
                        <div className="p-10">
                            <ShieldAlert size={64} className="mx-auto mb-4 text-red-400 opacity-50" />
                            <p className="font-bold text-red-500">{data.error}</p>
                            {countdown > 0 && <p className="mt-2 text-sm text-slate-400">Aktif kembali dalam {countdown} detik.</p>}
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 text-slate-200"><MonitorCheck size={80} strokeWidth={1} /></div>
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Ready to Check</h2>
                            <p className="mt-2 max-w-sm text-slate-500">Pastikan website Anda selalu aktif untuk pelanggan.</p>
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