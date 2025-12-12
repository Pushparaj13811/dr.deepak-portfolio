import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
