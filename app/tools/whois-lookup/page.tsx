'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Loader2, Globe, Calendar, Building2, ShieldAlert, Timer, Info, Zap, Check, Copy, AlertCircle, SearchCode, Server, ShieldCheck, ExternalLink } from 'lucide-react';

export default function WhoisPage() {
  const [inputDomain, setInputDomain] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [year, setYear] = useState<number | null>(null); // PERBAIKAN: State year ditambahkan

  useEffect(() => {
    setYear(new Date().getFullYear()); // PERBAIKAN: Mengisi tahun saat mounted
    
    const storedExpiry = localStorage.getItem('whois_limit_expiry');
    if (storedExpiry) {
      const timeLeft = Math.round((parseInt(storedExpiry) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setCountdown(timeLeft);
        setData({ error: "Terlalu banyak permintaan. Silakan coba lagi nanti." });
      } else {
        localStorage.removeItem('whois_limit_expiry');
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      const storedExpiry = localStorage.getItem('whois_limit_expiry');
      if (storedExpiry) {
        localStorage.removeItem('whois_limit_expiry');
        window.location.reload(); 
      }
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const fetchWhoisData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (countdown > 0) return;
    if (!inputDomain.trim()) { setValidationError('Silakan masukkan nama domain terlebih dahulu.'); return; }

    setLoading(true);
    setData(null);
    setValidationError('');

    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(inputDomain.trim())}`);
      const json = await res.json();
      
      if (!res.ok) {
        if (res.status === 429 && json.retryAfter) {
          const expiryTime = Date.now() + (json.retryAfter * 1000);
          localStorage.setItem('whois_limit_expiry', expiryTime.toString());
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => window.location.reload();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="sticky top-0 z-100 flex h-20 items-center border-b border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 md:gap-3 md:px-6">
          <button onClick={handleRefresh} className="relative h-7 w-26 md:h-8 md:w-39.5 transition-opacity hover:opacity-80 outline-none">
            <Image src="/images/logo.png" alt="IDnity Logo" fill className="object-contain object-left" priority />
          </button>
          <span className="text-xl font-light text-slate-300">|</span>
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">Whois Lookup</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="mb-6 w-full">
            <div className={`rounded-xl border bg-white p-6 shadow-sm transition-colors ${validationError ? 'border-red-300' : 'border-slate-200'}`}>
                <label className="mb-3 block text-sm font-medium text-slate-600 md:text-base tracking-tight">Domain to Lookup</label>
                <form onSubmit={fetchWhoisData} className="flex flex-col gap-3 sm:flex-row">
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
                                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Domain Details</span>
                            </div>
                            {loading ? (
                                <div className="p-6 animate-pulse space-y-4">
                                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-10 bg-slate-50 rounded w-full" />)}
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
                                    <DetailRow icon={<Globe className="text-blue-500" />} label="Domain Name" value={data.domain} copyAction={() => copyToClipboard(data.domain)} isCopied={copied} />
                                    <DetailRow icon={<Building2 className="text-purple-500" />} label="Registrar" value={data.registrar} />
                                    <DetailRow icon={<ShieldCheck className="text-emerald-500" />} label="Domain Status" value={data.domainStatus || 'OK'} />
                                    <DetailRow icon={<Calendar className="text-orange-500" />} label="Created Date" value={data.created ? new Date(data.created).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'N/A'} />
                                    <DetailRow icon={<Calendar className="text-blue-400" />} label="Last Updated" value={data.updated ? new Date(data.updated).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'N/A'} />
                                    <DetailRow icon={<Calendar className="text-red-500" />} label="Expiry Date" value={data.expiry ? new Date(data.expiry).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'N/A'} />
                                    <DetailRow icon={<Server className="text-blue-600" />} label="Nameservers" value={data.nameservers || 'N/A'} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="relative flex h-125 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden text-center">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="mx-auto h-32 w-32 rounded-full bg-slate-50" />
                                    <div className="h-8 w-48 bg-slate-50 rounded mx-auto" />
                                </div>
                            ) : !data?.error ? (
                                <>
                                    <div className={`mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full ${data.status === 'REGISTERED' ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-green-50 text-green-500 shadow-inner'}`}>
                                        <Globe size={64} strokeWidth={1.5} />
                                    </div>
                                    <h2 className={`text-4xl font-black uppercase tracking-tight ${data.status === 'REGISTERED' ? 'text-red-600' : 'text-green-600'}`}>
                                        {data.status === 'REGISTERED' ? 'Domain Terdaftar' : 'Domain Tersedia'}
                                    </h2>
                                    <p className="mt-2 text-lg font-medium text-slate-500 max-w-md">
                                        {data.status === 'REGISTERED' 
                                          ? `Domain ${data.domain} sudah dimiliki oleh pihak lain.` 
                                          : `Kabar baik! Domain ${data.domain} tersedia untuk didaftarkan.`}
                                    </p>
                                    
                                    {data.status === 'AVAILABLE' && (
                                      <a 
                                        href={`https://idnity.com/domain?domain=${data.domain}`} 
                                        target="_blank" 
                                        className="mt-8 flex items-center gap-2 rounded-full bg-green-600 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl"
                                      >
                                        Daftarkan Sekarang <ExternalLink size={18} />
                                      </a>
                                    )}
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
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">1</div> Masukkan nama domain lengkap (misal: idnity.com)</li>
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">2</div> Sistem akan mencari catatan pendaftaran domain secara global.</li>
                                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">3</div> Lihat detail pendaftaran, status, dan server nama domain tersebut.</li>
                            </ul>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-sm">
                            <Zap className="mb-3 opacity-50" size={24} />
                            <h4 className="font-bold">Did you know?</h4>
                            <p className="mt-1 text-sm leading-relaxed opacity-90">Mengecek data Whois secara berkala membantu Anda memantau kapan domain harus diperpanjang agar tidak lepas ke tangan orang lain.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="flex h-125 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 text-slate-200"><SearchCode size={80} strokeWidth={1} /></div>
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Whois Scan Ready</h2>
                            <p className="mt-2 max-w-sm text-slate-500">Dapatkan informasi pendaftaran domain terlengkap dalam hitungan detik.</p>
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

function DetailRow({ icon, label, value, copyAction, isCopied }: { icon: React.ReactNode, label: string, value: string | number, copyAction?: () => void, isCopied?: boolean }) {
    return (
        <div className="group flex items-center p-4 transition hover:bg-slate-50">
            <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 transition group-hover:border-slate-200 group-hover:bg-white">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-xs font-semibold uppercase text-slate-400 tracking-tighter">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-700">{value || '-'}</p>
                    {copyAction && (
                        <button onClick={copyAction} className="text-slate-400 hover:text-blue-600 transition-colors">
                            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}