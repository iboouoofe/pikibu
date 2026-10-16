'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bell, Zap, Brain, Milk, Check } from 'lucide-react'

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState({
    sweetspot: true,
    leaps: true,
    feeding: true,
    marketing: false
  })
  const [savedFeedback, setSavedFeedback] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pikibu_notification_prefs')
      if (saved) {
        setPrefs(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        localStorage.setItem('pikibu_notification_prefs', JSON.stringify(next))
        setSavedFeedback(true)
        setTimeout(() => setSavedFeedback(false), 2000)
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <div onClick={onClick} style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: active ? 'var(--coral)' : 'var(--bg-raised)',
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
    }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '10px', background: 'white',
        position: 'absolute', top: '2px', left: active ? '22px' : '2px',
        transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      <div style={{
        background: 'var(--bg-surface)', padding: '52px 20px 20px',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/settings" style={{ color: 'var(--text-primary)' }} aria-label="Geri">
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Bildirim Tercihleri</h1>
        </div>
        {savedFeedback && (
          <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={14} /> Kaydedildi
          </span>
        )}
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,113,227,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="var(--coral)" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>SweetSpot Uyarıları</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Uyku vakti yaklaştığında 15 dk önce hatırlat</div>
              </div>
            </div>
            <Toggle active={prefs.sweetspot} onClick={() => handleToggle('sweetspot')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(165,166,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} color="var(--lavender-dark)" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>Atak Haftaları</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Yeni bir zihinsel sıçrama başladığında haber ver</div>
              </div>
            </div>
            <Toggle active={prefs.leaps} onClick={() => handleToggle('leaps')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(142,186,154,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Milk size={18} color="var(--sage-dark)" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>Beslenme Hatırlatıcı</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>3 saatten uzun süre beslenme kaydı olmazsa uyar</div>
              </div>
            </div>
            <Toggle active={prefs.feeding} onClick={() => handleToggle('feeding')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={18} color="var(--text-muted)" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>Pikibu Bülteni & İpuçları</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ayına uygun pediatrik gelişim tavsiyeleri</div>
              </div>
            </div>
            <Toggle active={prefs.marketing} onClick={() => handleToggle('marketing')} />
          </div>

        </div>
      </div>
    </div>
  )
}
