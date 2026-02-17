import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whois Lookup',
  description: 'Cek detail kepemilikan domain, tanggal kadaluarsa, dan informasi registrar secara akurat.',
};

export default function WhoisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}