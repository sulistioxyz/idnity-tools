'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Globe, ShieldCheck, SearchCode, Database, Key, 
  Lock, Plug, Signal, MonitorCheck, ArrowRight,
  Zap, Code2, Search // Tambahkan ikon Search
} from 'lucide-react';

export default function HomePage() {
  const [year, setYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk fitur pencarian

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const tools = [
    {
      title: 'IP Checker',
      desc: 'Lacak lokasi IP, detail ISP, dan informasi jaringan secara real-time.',
      icon: <Globe className="text-blue-500" />,
      href: '/tools/ip-checker',
      color: 'bg-blue-50'
    },
    {
      title: 'SSL Checker',
      desc: 'Uji keamanan sertifikat SSL website Anda dan pantau masa berlakunya.',
      icon: <ShieldCheck className="text-emerald-500" />,
      href: '/tools/ssl-checker',
      color: 'bg-emerald-50'
    },
    {
      title: 'Whois Lookup',
      desc: 'Cek ketersediaan domain dan informasi pendaftaran (RDAP) secara mendalam.',
      icon: <SearchCode className="text-purple-500" />,
      href: '/tools/whois-lookup',
      color: 'bg-purple-50'
    },
    {
      title: 'DNS Checker',
      desc: 'Pantau catatan DNS (A, MX, NS, TXT) dan status propagasi global.',
      icon: <Database className="text-orange-500" />,
      href: '/tools/dns-checker',
      color: 'bg-orange-50'
    },
    {
      title: 'Password Generator',
      desc: 'Buat kata sandi super kuat dan aman secara lokal di browser Anda.',
      icon: <Key className="text-amber-500" />,
      href: '/tools/password-generator',
      color: 'bg-amber-50'
    },
    {
      title: 'Password Tester',
      desc: 'Uji seberapa lama peretas dapat membobol kata sandi Anda.',
      icon: <Lock className="text-rose-500" />,
      href: '/tools/password-tester',
      color: 'bg-rose-50'
    },
    {
      title: 'Port Scanner',
      desc: 'Cek status pintu layanan server seperti FTP, HTTP, dan Database.',
      icon: <Plug className="text-indigo-500" />,
      href: '/tools/port-scanner',
      color: 'bg-indigo-50'
    },
    {
      title: 'Ping Tool',
      desc: 'Uji latensi dan kecepatan respon server Anda dari berbagai lokasi.',
      icon: <Signal className="text-cyan-500" />,
      href: '/tools/ping',
      color: 'bg-cyan-50'
    },
    {
      title: 'Is Website Online?',
      desc: 'Cek apakah sebuah website sedang aktif atau mengalami gangguan.',
      icon: <MonitorCheck className="text-teal-500" />,
      href: '/tools/is-website-online',
      color: 'bg-teal-50'
    }
  ];

  // Logika Filter Tool berdasarkan Search Query
  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="sticky top-0 z-50 flex h-20 items-center border-b border-slate-100 bg-white/80 backdrop-blur-md">
  <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-6">
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-24 md:w-32">
        <Image src="/images/logo.png" alt="IDnity Logo" fill className="object-contain object-left" priority />
      </div>
      {/* Menghilangkan 'hidden md:block' agar muncul di semua ukuran layar */}
      <span className="text-xl font-light text-slate-300">|</span>
      <span className="text-[10px] md:text-sm font-bold tracking-tight text-slate-900 uppercase">Ecosystem</span>
    </div>
    <div className="flex items-center gap-4">
       {/* Menyesuaikan ukuran teks link agar lebih rapi di mobile */}
       <Link href="https://idnity.com" target="_blank" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Main Site</Link>
    </div>
  </div>
</header>

      <section className="relative overflow-hidden bg-white py-20 border-b border-slate-100">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 mb-6 uppercase tracking-wider">
            <Zap size={14} className="fill-blue-600" /> 9 Professional Web Tools Ready
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-6xl uppercase italic">
            IDnity <span className="text-blue-600">Tools</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500 leading-relaxed mb-8">
            Satu tempat untuk semua kebutuhan teknis web Anda. Dari pengecekan IP hingga analisis DNS mendalam—semuanya gratis dan cepat.
          </p>

          {/* --- FITUR SEARCH BAR --- */}
          <div className="mx-auto max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search tools (ex: DNS, SSL, Password...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl grow py-16 px-4 md:px-6">
        {/* Tampilkan pesan jika tidak ada hasil cari */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchCode size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tool tidak ditemukan</h3>
            <p className="text-slate-500 mt-2">Coba gunakan kata kunci lain atau bersihkan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool, index) => (
              <Link key={index} href={tool.href} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${tool.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  {tool.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600">{tool.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500 line-clamp-2">{tool.desc}</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-blue-600">
                  Launch Tool <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <section className="mx-auto mb-20 w-full max-w-6xl px-4 md:px-6">
        <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-2xl md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Code2 size={200} /></div>
            <div className="relative z-10 max-w-xl">
                <h4 className="mb-4 text-2xl font-bold tracking-tight">Butuh Hosting atau Domain?</h4>
                <p className="mb-8 text-slate-400 leading-relaxed">Dapatkan layanan Web Hosting dan pendaftaran Domain terbaik dengan performa tinggi dan keamanan terjamin hanya di IDnity.</p>
                <Link href="https://idnity.com" target="_blank" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 font-bold transition hover:bg-blue-700">
                    Kunjungi IDnity <ArrowRight size={18} />
                </Link>
            </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-12 text-center">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-6 flex justify-center opacity-30">
            <Image src="/images/logo.png" alt="IDnity Logo" width={100} height={30} className="grayscale" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            &copy; {year || '2026'} <span className="font-bold text-slate-900">IDnity Tools</span>. Part of IDnity Ecosystem.
          </p>
          <p className="mt-2 text-xs text-slate-400 italic">Created with ❤️ for Tech Enthusiasts and Web Developers.</p>
        </div>
      </footer>
    </div>
  );
}