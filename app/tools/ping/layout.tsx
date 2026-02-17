import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Ping Tool',
  description: 'Uji latensi dan kecepatan respon server atau website Anda secara real-time dengan akurasi tinggi.',
};

export default function PingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}