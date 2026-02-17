import { Metadata } from 'next';

// Metadata untuk SEO & Judul Tab Browser
export const metadata: Metadata = {
  title: 'Check IP Address',
  description: 'Lacak lokasi geografis, ISP, dan detail jaringan dari alamat IP publik secara akurat melalui IDnity Tools.',
};

// WAJIB: Harus ada 'export default' agar Next.js mengenalinya sebagai Layout
export default function IpCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}