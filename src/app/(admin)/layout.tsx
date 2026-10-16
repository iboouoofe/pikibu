import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: {
    template: '%s | Pikibu Admin',
    default: 'Pikibu Admin Panel',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg-base)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100dvh' }}>
        {children}
      </main>
    </div>
  )
}
