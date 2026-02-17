import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DNS Record Checker',
  description: 'Cek catatan DNS (A, MX, CNAME, TXT, NS) domain Anda secara real-time untuk memastikan propagasi hosting berjalan lancar.',
};

export default function DnsCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}