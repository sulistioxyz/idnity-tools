import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Port Scanner',
  description: 'Cek status port layanan server Anda secara real-time untuk memastikan FTP, HTTP, HTTPS, dan Database berjalan lancar.',
};

export default function PortScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}