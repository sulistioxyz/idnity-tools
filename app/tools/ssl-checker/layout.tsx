import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SSL Certificate Checker',
  description: 'Cek validitas, penerbit, dan masa berlaku sertifikat SSL domain Anda secara instan.',
};

export default function SslCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}