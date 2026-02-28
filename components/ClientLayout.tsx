'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname === '/login';

  if (isAuthPage) {
    return <main className="flex-1 overflow-y-auto">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto transition-colors flex flex-col relative">
        <div className="flex-1">
          {children}
        </div>
      </main>
    </>
  );
}
