'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, BookOpen, Bell, Settings,
  Baby, TrendingUp, LogOut, Shield
} from 'lucide-react'

const navGroups = [
  {
    label: 'Genel',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/analytics', icon: TrendingUp, label: 'Analitik & KPI' },
    ],
  },
  {
    label: 'Kullanıcılar',
    items: [
      { href: '/users', icon: Users, label: 'Kullanıcı Yönetimi' },
      { href: '/babies', icon: Baby, label: 'Bebek Profilleri' },
    ],
  },
  {
    label: 'İçerik',
    items: [
      { href: '/content/leaps', icon: BookOpen, label: 'Atak Haftaları' },
      { href: '/content/foods', icon: BookOpen, label: 'Ek Gıda Kütüphanesi' },
      { href: '/content/vaccines', icon: Shield, label: 'Aşı Takvimi' },
    ],
  },
  {
    label: 'Bildirimler',
    items: [
      { href: '/notifications', icon: Bell, label: 'Push Bildirimler' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--ink)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Baby size={20} color="white" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px' }}>Pikibu</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, color: 'var(--text-subtle)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '0 8px', marginBottom: '6px',
            }}>
              {group.label}
            </div>
            {group.items.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link key={href} href={href} className={`sidebar-nav-item ${active ? 'active' : ''}`}>
                  <Icon size={18} />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-light)' }}>
        <Link href="/admin/settings" className="sidebar-nav-item">
          <Settings size={18} />
          Ayarlar
        </Link>
        <button className="sidebar-nav-item" style={{ color: '#F87171' }}>
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}
