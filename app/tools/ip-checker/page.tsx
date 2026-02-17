'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, Loader2, MapPin, Globe, Server, Shield, Network, AlertCircle, ShieldAlert, Timer, Copy, Check } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// --- SETUP PETA (CLIENT-SIDE ONLY) ---
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

function RecenterMap({ lat, lon, useMapHook }: { lat: number, lon: number, useMapHook: any }) {
  const map = useMapHook();
  useEffect(() => {
    if (lat && lon && map) {
      map.setView([lat, lon], 13);
      // Penjaga stabilitas render peta
      setTimeout(() => map.invalidateSize(), 300);
    }
  }, [lat, lon, map]);
  return null;
}

interface IpData {
  ip: string; city: string; region: string; country: string;
  isp: string; asn: string; timezone: string; lat: number; lon: number; error?: string;
}

export default function IpCheckerPage() {
  const [hasMounted, setHasMounted] = useState(false); 
  const [inputIp, setInputIp] = useState('');
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);
  const [validationError, setValidationError] = useState('');
  const [LeafletMapHooks, setLeafletMapHooks] = useState<any>(null);
  const [countdown, setCountdown] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const initLeaflet = async () => {
      const L = (await import('leaflet')).default;
      const { useMap } = await import('react-leaflet');
      
      const icon = L.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
      });
      
      setCustomIcon(icon);
      setLeafletMapHooks({ useMap });

      const storedExpiry = localStorage.getItem('ip_checker_limit_expiry');
      if (storedExpiry) {
        const timeLeft = Math.round((parseInt(storedExpiry) - Date.now()) / 1000);
        if (timeLeft > 0) {
          setCountdown(timeLeft);
        } else {
          localStorage.removeItem('ip_checker_limit_expiry');
          fetchIpData();
        }
      } else {
        fetchIpData(); 
      }
      
      setHasMounted(true); // Barrier: Jangan render Leaflet sebelum ini true
    };
    initLeaflet();
  }, []);

  // LOGIKA: Otomatis refresh saat countdown menyentuh 0
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      const storedExpiry = localStorage.getItem('ip_checker_limit_expiry');
      if (storedExpiry) {
        localStorage.removeItem('ip_checker_limit_expiry');
        window.location.reload(); 
      }
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const fetchIpData = async (ipToLookup: string = '') => {
    setLoading(true);
    setValidationError('');
    try {
      const url = ipToLookup ? `/api/my-ip?ip=${ipToLookup}` : '/api/my-ip';
      const res = await fetch(url);
      const json = await res.json();
      
      if (!res.ok) {
        if (res.status === 429 && json.retryAfter) {
          const expiryTime = Date.now() + (json.retryAfter * 1000);
          localStorage.setItem('ip_checker_limit_expiry', expiryTime.toString());
          setCountdown(json.retryAfter);
        }
        setData({ ...json, ip: ipToLookup || 'Unknown', error: json.error || "IP yang dimasukan tidak Valid", lat: 0, lon: 0 } as IpData);
      } else {
        setData(json);
        if (!ipToLookup) setInputIp(json.ip);
      }
    } catch (error) {
      setData({ error: 'Gagal menghubungi server.', ip: ipToLookup || '-', lat: 0, lon: 0 } as IpData);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setInputIp(val);
    if (val) setValidationError('');
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (countdown > 0) return;
    if (!inputIp.trim()) { setValidationError('Silakan masukkan alamat IP terlebih dahulu.'); return; }
    
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(inputIp)) {
        setData({ error: "IP yang dimasukan tidak Valid", ip: inputIp, lat: 0, lon: 0 } as IpData);
        return;
    }
    fetchIpData(inputIp);
  };

  const handleManualRefresh = () => window.location.reload();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      
      <header className="sticky top-0 z-100 flex h-20 items-center border-b border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 md:gap-3 md:px-6">
          <button onClick={handleManualRefresh} className="relative h-7 w-26 md:h-8 md:w-39.5 transition-opacity hover:opacity-80 outline-none">
            <Image src="/images/logo.png" alt="IDnity Logo" fill className="object-contain object-left" priority />
          </button>
          <span className="text-xl font-light text-slate-300">|</span>
          <h1 className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 md:text-base">Check IP Address</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl grow py-10 px-4 md:px-6">
        <div className="mb-6 w-full">
            <div className={`rounded-xl border bg-white p-6 shadow-sm transition-colors ${validationError ? 'border-red-300' : 'border-slate-200'}`}>
                <label className="mb-3 block text-sm font-medium text-slate-600 md:text-base">IP Address to Check</label>
                <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
                    <div className="grow">
                        <input 
                            type="text" inputMode="decimal" placeholder="8.8.8.8"
                            className={`w-full rounded-lg border px-4 py-3 text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500 ${validationError ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500'}`}
                            value={inputIp} onChange={handleInputChange}
                        />
                        {validationError && (
                            <div className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600"><AlertCircle size={14} /> {validationError}</div>
                        )}
                    </div>
                    <button type="submit" disabled={loading || countdown > 0} className={`flex h-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg px-8 py-3 font-medium text-white transition disabled:opacity-70 ${countdown > 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />} {countdown > 0 ? `Wait ${countdown}s` : 'Lookup'}
                    </button>
                </form>
            </div>
        </div>

        {data && (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="flex flex-col gap-4 lg:col-span-5">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Result Details</span>
                            {!data.error && (
                                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span> Live
                                </span>
                            )}
                        </div>
                        {data.error ? (
                             <div className="p-10 text-center">
                                <ShieldAlert size={40} className="mx-auto mb-3 text-red-400 opacity-50" />
                                <p className="text-sm font-bold text-red-500">{data.error}</p>
                                {countdown > 0 && (
                                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600"><Timer size={14} className="animate-pulse" /> Tombol aktif kembali dalam {countdown} detik</div>
                                )}
                             </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                <DetailRow 
                                  icon={<Network className="text-blue-500" />} 
                                  label="IP Address" 
                                  value={data.ip} 
                                  isHighlight 
                                  copyAction={() => copyToClipboard(data.ip)}
                                  isCopied={copied}
                                />
                                <DetailRow icon={<Server className="text-purple-500" />} label="ISP Name" value={data.isp} />
                                <DetailRow icon={<Shield className="text-orange-500" />} label="AS Number" value={data.asn} />
                                <DetailRow icon={<Globe className="text-cyan-500" />} label="Country" value={data.country} />
                                <DetailRow icon={<MapPin className="text-red-500" />} label="Region/City" value={`${data.region}, ${data.city}`} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-7">
                    {/* CONTAINER WRAPPER UNTUK PETA */}
                    <div 
                      key={data.lat ? `map-${data.lat}-${data.lon}` : 'no-map'} 
                      className="relative z-0 h-125 rounded-xl border border-slate-200 bg-white p-1 shadow-sm overflow-hidden"
                    >
                        {hasMounted && !loading && data.lat && data.lon && customIcon ? (
                             <MapContainer 
                                center={[data.lat, data.lon]} 
                                zoom={13} 
                                scrollWheelZoom={false} 
                                className="z-0 h-full w-full rounded-lg"
                             >
                                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <RecenterMap lat={data.lat} lon={data.lon} useMapHook={LeafletMapHooks.useMap} />
                                <Marker position={[data.lat, data.lon]} icon={customIcon}>
                                    <Popup className="font-sans text-sm"><strong>{data.isp}</strong><br />{data.city}, {data.country}</Popup>
                                </Marker>
                             </MapContainer>
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-slate-50 text-slate-400 font-medium">
                                <Globe size={48} className="mb-4 opacity-20" />
                                <p>{loading ? 'Memuat Peta...' : 'Peta lokasi tidak tersedia'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
          <div className="mx-auto px-6 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} <strong>IDnity Tools</strong>. Part of IDnity Ecosystem.</p>
          </div>
      </footer>
    </div>
  );
}

function DetailRow({ icon, label, value, isHighlight = false, copyAction, isCopied }: { icon: React.ReactNode, label: string, value: string | number, isHighlight?: boolean, copyAction?: () => void, isCopied?: boolean }) {
    return (
        <div className="group flex items-center p-4 transition hover:bg-slate-50">
            <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 transition group-hover:border-slate-200 group-hover:bg-white">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-xs font-semibold uppercase text-slate-400 tracking-tighter">{label}</p>
                <div className="flex items-center gap-2">
                    <p className={`truncate text-sm ${isHighlight ? 'font-mono text-base font-bold text-blue-700' : 'font-semibold text-slate-700'}`}>{value || '-'}</p>
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