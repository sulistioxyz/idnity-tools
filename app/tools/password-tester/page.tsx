'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, Eye, EyeOff, ShieldAlert, Timer, Info, Zap, Check, Lock, Shield, AlertTriangle } from 'lucide-react';

// --- KOMPONEN PENDUKUNG (PINDAH KE ATAS AGAR TERBACA TS) ---
function Requirement({ met, label }: { met: boolean, label: string }) {
  return (
    <div className={`flex items-center gap-3 text-sm font-medium transition-colors ${met ? 'text-green-600' : 'text-slate-400'}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${met ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
        {met ? <Check size={14} /> : <div className="h-1 w-1 rounded-full bg-slate-300" />}
      </div>
      {label}
    </div>
  );
}

export default function PasswordTesterPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'Waiting...', color: 'bg-slate-200', time: 'N/A' });
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const testStrength = (p: string) => {
      if (!p) {
        setStrength({ score: 0, label: 'Waiting...', color: 'bg-slate-200', time: 'N/A' });
        return;
      }

      let score = 0;
      if (p.length >= 8) score++;
      if (p.length >= 12) score++;
      if (/[A-Z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;

      const results = [
        { label: 'Very Weak', color: 'bg-red-500', time: 'Instant' },
        { label: 'Weak', color: 'bg-orange-500', time: 'Seconds' },
        { label: 'Medium', color: 'bg-yellow-500', time: 'Hours/Days' },
        { label: 'Strong', color: 'bg-green-500', time: 'Months' },
        { label: 'Very Strong', color: 'bg-emerald-600', time: 'Years/Centuries' },
        { label: 'Ultimate', color: 'bg-blue-600', time: 'Eons' }
      ];

      setStrength({ ...results[score], score });
    };

    testStrength(password);
  }, [password]);

  const handleRefresh = () => window.location.reload();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="sticky top-0 z-100 flex h-20 items-center border-b border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 md:gap-3 md:px-6">
          <button onClick={handleRefresh} className="relative h-7 w-26 transition-opacity hover:opacity-80 outline-none">
            <Image src="/images/logo.png" alt="IDnity Logo" fill className="object-contain object-left" priority />
          </button>
          <span className="text-xl font-light text-slate-300">|</span>
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">Password Tester</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="mb-6 w-full">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Label Camel Case */}
            <label className="mb-3 block text-sm font-medium text-slate-600 md:text-base tracking-tight">Password to Test</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi Anda..."
                className="w-full rounded-lg border border-slate-300 px-4 py-4 pr-12 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">Security Analysis</h3>
              
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-600">Strength Score</span>
                  <span className={strength.score > 2 ? 'text-green-600' : 'text-red-500'}>{strength.label}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-4">
                <Requirement met={password.length >= 8} label="Minimal 8 karakter" />
                <Requirement met={/[A-Z]/.test(password)} label="Mengandung huruf kapital" />
                <Requirement met={/[0-9]/.test(password)} label="Mengandung angka" />
                <Requirement met={/[^A-Za-z0-9]/.test(password)} label="Mengandung simbol khusus" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-sm">
              <Zap className="mb-3 opacity-50" size={24} />
              <h4 className="font-bold uppercase tracking-tighter">Did you know?</h4>
              <p className="mt-1 text-sm leading-relaxed opacity-90">
                Menambahkan satu karakter unik atau spasi pada kata sandi Anda dapat melipatgandakan waktu yang dibutuhkan peretas untuk membobolnya hingga ribuan kali lipat.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Pakai class canonical lg:min-h-150 */}
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm lg:min-h-150">
              <div className={`mb-8 flex h-32 w-32 items-center justify-center rounded-full shadow-inner ${password ? (strength.score > 3 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500') : 'bg-slate-50 text-slate-300'}`}>
                {strength.score > 3 ? <ShieldCheck size={64} strokeWidth={1.5} /> : <ShieldAlert size={64} strokeWidth={1.5} />}
              </div>
              
              <h2 className="mb-2 text-2xl font-bold text-slate-900 tracking-tight">Time to Crack</h2>
              <p className="mb-8 text-slate-500 italic">Estimasi waktu untuk membobol kata sandi Anda.</p>

              <div className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 p-8 transition-all hover:bg-white">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 shadow-sm">
                  <Timer size={14} /> Estimated Hack Time
                </div>
                <p className={`text-4xl font-black md:text-5xl ${strength.score > 3 ? 'text-green-600' : 'text-red-500'}`}>
                  {strength.time}
                </p>
              </div>

              <div className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                <Lock size={14} /> Local Processing: Data Anda tidak dikirim ke server.
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