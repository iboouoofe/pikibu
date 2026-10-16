'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, User, Bell, Shield, LogOut, ChevronRight, Palette, Loader2, Baby } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (!confirm('Çıkış yapmak istediğinize emin misiniz?')) return
    setLoggingOut(true)

    try {
      // 1. Clear demo cookie on client
      document.cookie = 'pikibu_demo_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
      localStorage.removeItem('pikibu_demo_session')
      sessionStorage.clear()

      // 2. Client-side Supabase sign out
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch (e) {
        console.warn('Supabase client signout error:', e)
      }

      // 3. Server-side session & cookies cleanup
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch (e) {
        console.warn('Logout API call error:', e)
      }

      // 4. Hard navigate to login to clear all in-memory routers/caches
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/login'
    }
  }

  const items = [
    { id: 'baby', icon: Baby, label: 'Bebek Profili (Ad & Doğum Tarihi)', color: 'var(--coral)', href: '/settings/baby' },
    { id: 'account', icon: User, label: 'Hesap', color: 'var(--accent)', href: '/settings/account' },
    { id: 'theme', icon: Palette, label: 'Görünüm', color: 'var(--lavender)', href: '/settings/theme' },
    { id: 'notifications', icon: Bell, label: 'Bildirimler', color: 'var(--pink)', href: '/settings/notifications' },
    { id: 'privacy', icon: Shield, label: 'Gizlilik ve Güvenlik', color: 'var(--sage)', href: '/settings/privacy' },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      <header className="page-header" style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 12px 10px' }}>
        <Link href="/dashboard" id="settings-back" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--accent)', fontSize: '17px' }}>
          <ChevronLeft size={24} strokeWidth={2} /> Bugün
        </Link>
      </header>

      <div style={{ padding: '8px 16px 120px', maxWidth: '520px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '34px', fontWeight: 700, letterSpacing: '-0.04em', padding: '0 4px', margin: '8px 0 24px' }}>Ayarlar</h1>

        <div className="list-group" style={{ marginBottom: '28px' }}>
          {items.map((item) => (
            <Link key={item.id} id={`settings-${item.id}`} href={item.href} className="list-row">
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={16} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ flex: 1, fontSize: '16px', fontWeight: 400, letterSpacing: '-0.015em' }}>{item.label}</span>
              <ChevronRight size={17} color="var(--text-subtle)" />
            </Link>
          ))}
        </div>

        <div className="list-group">
          <button
            id="logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            className="list-row"
            style={{
              width: '100%', border: 'none', background: 'transparent', justifyContent: 'center',
              color: 'var(--danger)', fontSize: '16px', fontWeight: 500,
              cursor: loggingOut ? 'not-allowed' : 'pointer', opacity: loggingOut ? 0.6 : 1,
            }}
          >
            {loggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} strokeWidth={1.8} />}
            {loggingOut ? 'Çıkış yapılıyor…' : 'Çıkış Yap'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: 'var(--text-subtle)' }}>
          Pikibu 1.0.0
        </p>
      </div>
    </div>
  )
}
