'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, Copy, Check, RefreshCw, Zap, Info, Lock, Hash, Type, Sparkles } from 'lucide-react';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
    generatePassword();
  }, []);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">Password Generator</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          
          {/* Kolom Kiri: Pengaturan */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                Customize Password
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700 tracking-tight">Password Length: {length}</label>
                  <input 
                    type="range" min="8" max="50" value={length} 
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600"
                  />
                </div>

                <div className="space-y-3">
                  <OptionToggle label="Include Uppercase" active={includeUppercase} onClick={() => setIncludeUppercase(!includeUppercase)} icon={<Type size={16} />} />
                  <OptionToggle label="Include Numbers" active={includeNumbers} onClick={() => setIncludeNumbers(!includeNumbers)} icon={<Hash size={16} />} />
                  <OptionToggle label="Include Symbols" active={includeSymbols} onClick={() => setIncludeSymbols(!includeSymbols)} icon={<Sparkles size={16} />} />
                </div>

                <button 
                  onClick={generatePassword}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <RefreshCw size={20} /> Generate Password
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
                <Info size={18} className="text-blue-500" /> How it works
              </h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">1</div> Atur panjang karakter yang diinginkan (minimal 8).</li>
                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">2</div> Aktifkan kombinasi angka dan simbol agar lebih aman.</li>
                <li className="flex gap-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">3</div> Salin password dan gunakan untuk akun Anda.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-sm">
              <Zap className="mb-3 opacity-50" size={24} />
              <h4 className="font-bold uppercase tracking-tighter">Did you know?</h4>
              <p className="mt-1 text-sm leading-relaxed opacity-90">
                Password dengan 16 karakter yang mencakup simbol dan angka membutuhkan waktu ribuan tahun bagi peretas untuk dibobol menggunakan metode brute force.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Perbaikan Class lg:min-h-150 */}
          <div className="lg:col-span-7">
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm lg:min-h-150">
              <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-inner">
                <Lock size={64} strokeWidth={1.5} />
              </div>
              
              <h2 className="mb-2 text-2xl font-bold text-slate-900 tracking-tight">Your Secure Password</h2>
              <p className="mb-8 text-slate-500">Gunakan kata sandi ini untuk keamanan maksimal.</p>

              <div className="group relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-300 hover:bg-white">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Generated String</span>
                <p className="break-all font-mono text-xl font-bold text-blue-700 md:text-3xl">
                  {password}
                </p>
                <button 
                  onClick={copyToClipboard}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold transition ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy Password'}
                </button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-medium text-green-600">
                <ShieldCheck size={18} /> Keamanan Terjamin: Dibuat secara lokal di browser Anda.
              </div>
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

function OptionToggle({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg border p-4 transition ${active ? 'border-blue-200 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      <div className={`h-5 w-5 rounded-full border-2 transition-all ${active ? 'border-blue-600 bg-blue-600 shadow-[0_0_0_2px_white_inset]' : 'border-slate-200 bg-transparent'}`} />
    </button>
  );
}