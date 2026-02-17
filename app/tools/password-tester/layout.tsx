import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Tester',
  description: 'Uji kekuatan kata sandi Anda dan ketahui seberapa lama peretas dapat membobolnya dengan algoritma keamanan terbaru.',
};

export default function PasswordTesterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}