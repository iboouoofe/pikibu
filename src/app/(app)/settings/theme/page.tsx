'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }} />
  }

  const themes = [
    { id: 'light', label: 'Açık Tema', icon: Sun },
    { id: 'dark', label: 'Koyu Tema', icon: Moon },
    { id: 'system', label: 'Sistem Teması', icon: Monitor },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '52px 20px 20px',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', gap: '16px'
      }}>
        <Link href="/settings" style={{ color: 'var(--text-primary)' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Görünüm ve Tema</h1>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '520px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            Pikibu'nun görünümünü tercihlerinize göre özelleştirin. Koyu tema geceleri göz yorgunluğunu azaltmak için harikadır.
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          {themes.map((t, index) => (
            <button key={t.id} 
              onClick={() => setTheme(t.id)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px', background: 'none', cursor: 'pointer',
                border: 'none', borderBottom: index !== themes.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', 
                  background: theme === t.id ? 'var(--coral)' : 'var(--bg-raised)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s'
                }}>
                  <t.icon size={18} color={theme === t.id ? 'white' : 'var(--text-muted)'} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: theme === t.id ? 700 : 600, color: 'var(--text-primary)' }}>
                  {t.label}
                </span>
              </div>
              
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                border: `2px solid ${theme === t.id ? 'var(--coral)' : 'var(--border-medium)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {theme === t.id && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--coral)' }} />}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
