import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Buat kata sandi yang kuat dan aman secara instan untuk akun hosting, email, dan database Anda.',
};

export default function PasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}