import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Is Website Online?',
  description: 'Cek status website Anda secara instan untuk mengetahui apakah sedang online atau sedang mengalami gangguan.',
};

export default function WebsiteOnlineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}