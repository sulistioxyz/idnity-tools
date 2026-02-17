'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Loader2, Globe, Server, Mail, FileText, Activity, ShieldAlert, Timer, Info, Zap, Check, Copy, AlertCircle, LayoutGrid } from 'lucide-react';

export default function DnsCheckerPage() {
  const [inputDomain, setInputDomain] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [year, setYear] = useState<number | null>(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear());
    const storedExpiry = localStorage.getItem('dns_limit_expiry');
    if (storedExpiry) {
      const timeLeft = Math.round((parseInt(storedExpiry) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setCountdown(timeLeft);
        setData({ error: "Terlalu banyak permintaan. Silakan coba lagi nanti." });
      } else {
        localStorage.removeItem('dns_limit_expiry');
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      const storedExpiry = localStorage.getItem('dns_limit_expiry');
      if (storedExpiry) {
        localStorage.removeItem('dns_limit_expiry');
        window.location.reload(); 
      }
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const fetchDnsData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (countdown > 0) return;
    if (!inputDomain.trim()) { 
      setValidationError('Silakan masukkan nama domain terlebih dahulu.'); 
      return; 
    }

    setLoading(true);
    setData(null);
    setValidationError('');

    try {
      const res = await fetch(`/api/dns?domain=${encodeURIComponent(inputDomain.trim())}`);
      const json = await res.json();
      
      if (!res.ok) {
        if (res.status === 429 && json.retryAfter) {
          const expiryTime = Date.now() + (json.retryAfter * 1000);
          localStorage.setItem('dns_limit_expiry', expiryTime.toString());
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
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">DNS Record Checker</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="mb-6 w-full">
            <div className={`rounded-xl border bg-white p-6 shadow-sm transition-colors ${validationError ? 'border-red-300' : 'border-slate-200'}`}>
                <label className="mb-3 block text-sm font-medium text-slate-600 md:text-base tracking-tight">Domain to Check DNS</label>
                <form onSubmit={fetchDnsData} className="flex flex-col gap-3 sm:flex-row">
                    <div className="grow">
                        <input 
                            type="text" placeholder="idnity.com"
                            className={`w-full rounded-lg border px-4 py-3 text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500 ${validationError ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500'}`}
                            value={inputDomain}
                            onChange={(e) => { setInputDomain(e.target.value); if (e.target.value) setValidationError(''); }}
                        />
                        {validationError && (
                            <div className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600"><AlertCircle size={14} /> {validationError}</div>
                        )}
                    </div>
                    <button type="submit" disabled={loading || countdown > 0} className={`flex h-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg px-8 py-3 font-medium text-white transition disabled:opacity-70 ${countdown > 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'}`}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />} 
                        {countdown > 0 ? `Wait ${countdown}s` : 'Lookup'}
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
                                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Record Details</span>
                            </div>
                            {loading ? (
                                <div className="p-6 animate-pulse space-y-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-50 rounded w-full" />)}
                                </div>
                            ) : data?.error ? (
                                <div className="p-10 text-center">
                                    <ShieldAlert size={40} className="mx-auto mb-3 text-red-400 opacity-50" />
                                    <p className="text-sm font-bold text-red-500">{data.error}</p>
                                    {countdown > 0 && (
                                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600"><Timer size={14} className="animate-pulse" /> Tombol aktif kembali dalam {countdown} detik</div>
                                    )}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    <DnsRow icon={<Server className="text-blue-500" />} type="A Record" values={data.records.A} />
                                    <DnsRow icon={<Mail className="text-purple-500" />} type="MX Record" values={data.records.MX.map((m: any) => `${m.exchange} (Priority: ${m.priority})`)} />
                                    <DnsRow icon={<Globe className="text-emerald-500" />} type="Name Servers" values={data.records.NS} />
                                    <DnsRow icon={<FileText className="text-orange-500" />} type="TXT Record" values={data.records.TXT} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Global Propagation (A Record)</span>
                                {!data?.error && !loading && data?.propagation && (
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700 uppercase">Live Check</span>
                                )}
                            </div>

                            <div className="h-125 overflow-y-auto">
                                {loading ? (
                                    <div className="flex h-full flex-col items-center justify-center p-10 animate-pulse">
                                        <Loader2 className="mb-4 animate-spin text-blue-500" size={40} />
                                        <p className="text-sm font-medium text-slate-400">Pinging global nodes...</p>
                                    </div>
                                ) : data?.propagation ? (
                                    <div className="divide-y divide-slate-100">
                                        {data.propagation.map((node: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-5 transition hover:bg-slate-50">
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-xs ${node.status === 'OK' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {node.location}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">{node.name}</p>
                                                        <p className="text-xs text-slate-400">{node.ip}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-mono font-bold ${node.status === 'OK' ? 'text-blue-600' : 'text-red-400'}`}>
                                                        {node.result}
                                                    </p>
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-300">
                                                        {node.status === 'OK' ? 'RESOLVED' : 'TIMED OUT'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="bg-blue-50/50 p-6 text-center text-xs leading-relaxed text-slate-500 italic">
                                            *Data di atas adalah hasil query real-time ke berbagai DNS Resolver dunia.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center p-10 text-center text-slate-400">
                                        <Globe size={64} className="mb-4 opacity-10" />
                                        <p className="max-w-xs text-sm font-medium">Masukkan domain untuk melihat status penyebaran DNS di berbagai benua.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-4 lg:col-span-5">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900"><Info size={18} className="text-blue-500" /> How it works</h3>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">1</div> Masukkan nama domain (misal: idnity.com)</li>
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">2</div> Sistem akan menarik data DNS terbaru dari server pusat.</li>
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">3</div> Cek apakah record A, MX, dan NS sudah sesuai dengan server Anda.</li>
                            </ul>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-sm">
                            <Zap className="mb-3 opacity-50" size={24} />
                            <h4 className="font-bold">Did you know?</h4>
                            {/* REVISI: Teks sekarang lebih bersifat edukasi */}
                            <p className="mt-1 text-sm leading-relaxed opacity-90">DNS (Domain Name System) adalah "buku telepon" internet yang mengubah domain yang mudah diingat menjadi alamat IP numerik agar server dapat saling berkomunikasi.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="flex h-125 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 text-slate-200"><LayoutGrid size={80} strokeWidth={1} /></div>
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">DNS Scan Ready</h2>
                            <p className="mt-2 max-w-sm text-slate-500">Pantau catatan DNS domain Anda secara instan dan akurat.</p>
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

function DnsRow({ icon, type, values }: { icon: React.ReactNode, type: string, values: string[] }) {
    return (
        <div className="p-4 transition hover:bg-slate-50">
            <div className="flex items-center mb-2">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">{icon}</div>
                <p className="text-xs font-semibold uppercase text-slate-400 tracking-tighter">{type}</p>
            </div>
            <div className="pl-11 space-y-1">
                {values && values.length > 0 ? (
                    values.map((v, i) => <p key={i} className="text-sm font-bold text-slate-700 break-all">{v}</p>)
                ) : (
                    <p className="text-sm font-medium text-slate-300 italic">No records found</p>
                )}
            </div>
        </div>
    );
}