'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// PERBAIKAN: Menambahkan AlertCircle ke dalam daftar import
import { Search, Loader2, Activity, ShieldAlert, Timer, Info, Zap, Check, LayoutGrid, Terminal, Plug, Server, AlertCircle } from 'lucide-react';

export default function PortScannerPage() {
  const [target, setTarget] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [year, setYear] = useState<number | null>(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear());
    const storedExpiry = localStorage.getItem('port_limit_expiry');
    if (storedExpiry) {
      const timeLeft = Math.round((parseInt(storedExpiry) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setCountdown(timeLeft);
        setData({ error: "Terlalu banyak permintaan. Silakan coba lagi nanti." });
      } else {
        localStorage.removeItem('port_limit_expiry');
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      const storedExpiry = localStorage.getItem('port_limit_expiry');
      if (storedExpiry) {
        localStorage.removeItem('port_limit_expiry');
        window.location.reload(); 
      }
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (countdown > 0) return;
    if (!target.trim()) { setValidationError('Masukkan IP atau Domain target.'); return; }

    setLoading(true);
    setData(null);
    setValidationError('');

    try {
      const res = await fetch(`/api/port-scanner?target=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      
      if (!res.ok) {
        if (res.status === 429 && json.retryAfter) {
          const expiryTime = Date.now() + (json.retryAfter * 1000);
          localStorage.setItem('port_limit_expiry', expiryTime.toString());
          setCountdown(json.retryAfter);
        }
        setData({ error: json.error || "Terjadi kesalahan" });
      } else {
        setData(json);
      }
    } catch (err) {
      setData({ error: "Gagal menghubungi server API" });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => window.location.reload();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="sticky top-0 z-100 flex h-20 items-center border-b border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 md:gap-3 md:px-6">
          <button onClick={handleRefresh} className="relative h-7 w-26 transition-opacity hover:opacity-80 outline-none">
            <Image src="/images/logo.png" alt="IDnity Logo" fill className="object-contain object-left" priority />
          </button>
          <span className="text-xl font-light text-slate-300">|</span>
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">Port Scanner</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="mb-6 w-full">
            <div className={`rounded-xl border bg-white p-6 shadow-sm transition-colors ${validationError ? 'border-red-300' : 'border-slate-200'}`}>
                <label className="mb-3 block text-sm font-medium text-slate-600 md:text-base tracking-tight">Target to Scan</label>
                <form onSubmit={handleScan} className="flex flex-col gap-3 sm:flex-row">
                    <div className="grow">
                        <input 
                            type="text" placeholder="103.xxx.xxx.xxx atau idnity.com"
                            className={`w-full rounded-lg border px-4 py-3 text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500 ${validationError ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500'}`}
                            value={target}
                            onChange={(e) => { setTarget(e.target.value); if (e.target.value) setValidationError(''); }}
                        />
                        {validationError && (
                            <div className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600"><AlertCircle size={14} className="inline mr-1" /> {validationError}</div>
                        )}
                    </div>
                    <button type="submit" disabled={loading || countdown > 0} className={`flex h-fit items-center justify-center gap-2 rounded-lg px-8 py-3 font-medium text-white transition disabled:opacity-70 ${countdown > 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'}`}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />} 
                        {countdown > 0 ? `Wait ${countdown}s` : 'Scan Ports'}
                    </button>
                </form>
            </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {(data || loading || countdown > 0) ? (
                <>
                    <div className="flex flex-col gap-4 lg:col-span-5">
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Service Status</span>
                            </div>
                            {loading ? (
                                <div className="p-6 animate-pulse space-y-4">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-slate-50 rounded w-full" />)}
                                </div>
                            ) : data?.error ? (
                                <div className="p-10 text-center">
                                    <ShieldAlert size={40} className="mx-auto mb-3 text-red-400 opacity-50" />
                                    <p className="text-sm font-bold text-red-500">{data.error}</p>
                                    {countdown > 0 && <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600"><Timer size={14} className="animate-pulse" /> Tombol aktif kembali dalam {countdown} detik</div>}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {data.results.map((p: any) => (
                                      <div key={p.port} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-3">
                                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${p.status === 'Open' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-400'}`}><Plug size={16} /></div>
                                          <div>
                                            <p className="text-sm font-bold text-slate-700">{p.service}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Port {p.port}</p>
                                          </div>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${p.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>{p.status}</span>
                                      </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        {/* PERBAIKAN: min-h-[500px] diubah menjadi min-h-125 */}
                        <div className="flex h-full min-h-125 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="mx-auto h-32 w-32 rounded-full bg-slate-50" />
                                    <div className="h-8 w-48 bg-slate-50 rounded mx-auto" />
                                </div>
                            ) : !data?.error ? (
                                <>
                                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-blue-50 text-blue-500 shadow-inner">
                                        <Activity size={64} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-4xl font-black uppercase tracking-tight text-blue-600">Scan Complete</h2>
                                    <p className="mt-2 text-lg font-medium text-slate-500 max-w-md">Hasil pemindaian port untuk target <strong>{data.target}</strong>.</p>
                                </>
                            ) : (
                                <><ShieldAlert size={64} className="mx-auto mb-4 opacity-20 text-slate-400" /><p className="text-lg font-medium text-slate-400">Data tidak tersedia</p></>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-4 lg:col-span-5">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900"><Info size={18} className="text-blue-500" /> How it works</h3>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">1</div> Masukkan IP server atau domain (misal: idnity.com).</li>
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">2</div> Sistem akan mengecek status port layanan umum secara otomatis.</li>
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">3</div> Pastikan port penting seperti 80 (HTTP) dan 443 (HTTPS) berstatus Open.</li>
                            </ul>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-sm">
                            <Zap className="mb-3 opacity-50" size={24} />
                            <h4 className="font-bold uppercase tracking-tighter">Did you know?</h4>
                            <p className="mt-1 text-sm leading-relaxed opacity-90">Port adalah pintu virtual di server. Jika port 80/443 tertutup, website Anda tidak akan bisa diakses meskipun server dalam keadaan menyala.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        {/* PERBAIKAN: min-h-[500px] diubah menjadi min-h-125 */}
                        <div className="flex h-full min-h-125 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 text-slate-200"><Server size={80} strokeWidth={1} /></div>
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Port Scan Ready</h2>
                            <p className="mt-2 max-w-sm text-slate-500">Ketahui status pintu layanan server Anda dalam sekejap.</p>
                        </div>
                    </div>
                </>
            )}
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          <p>&copy; {year || '2026'} <strong>IDnity Tools</strong>. Part of IDnity Ecosystem.</p>
      </footer>
    </div>
  );
}