'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Baby, Calendar, Check, Loader2 } from 'lucide-react'

export default function BabySettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [babyName, setBabyName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<'female' | 'male' | ''>('')

  useEffect(() => {
    async function loadBaby() {
      try {
        const res = await fetch('/api/baby')
        if (res.ok) {
          const data = await res.json()
          if (data.baby) {
            setBabyName(data.baby.name || '')
            if (data.baby.birthDate) {
              setBirthDate(new Date(data.baby.birthDate).toISOString().split('T')[0])
            }
            setGender(data.baby.gender || '')
          }
        }
      } catch (e) {
        console.error('Failed to load baby data:', e)
      } finally {
        setLoading(false)
      }
    }
    loadBaby()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!babyName.trim() || !birthDate) {
      setError('Lütfen bebeğin adını ve doğum tarihini doldurun.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          babyName: babyName.trim(),
          birthDate,
          gender: gender || null,
        }),
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Kaydedilemedi.')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  const maxDate = new Date().toISOString().split('T')[0]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      <div style={{
        background: 'var(--bg-surface)', padding: '52px 20px 20px',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', gap: '16px'
      }}>
        <Link href="/settings" style={{ color: 'var(--text-primary)' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Bebek Profili</h1>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '520px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <p>Bebek bilgileri yükleniyor...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            {error && (
              <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '14px', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(74,222,128,0.12)', color: 'var(--sage-dark)', fontSize: '14px', marginBottom: '16px' }}>
                <Check size={16} strokeWidth={2.5} /> Bilgiler başarıyla güncellendi!
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <Baby size={16} /> Bebeğin Adı
              </label>
              <input
                type="text"
                required
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="Örn. Zeynep"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-raised)', color: 'var(--text-primary)', fontSize: '15px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <Calendar size={16} /> Doğum Tarihi
              </label>
              <input
                type="date"
                required
                max={maxDate}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-raised)', color: 'var(--text-primary)', fontSize: '15px' }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Cinsiyet
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {(['female', 'male'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(gender === g ? '' : g)}
                    style={{
                      padding: '12px', borderRadius: '12px',
                      border: `1.5px solid ${gender === g ? 'var(--accent)' : 'var(--border-light)'}`,
                      background: gender === g ? 'var(--accent-soft)' : 'var(--bg-raised)',
                      color: gender === g ? 'var(--accent)' : 'var(--text-primary)',
                      fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    {g === 'female' ? '👧 Kız' : '👦 Erkek'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-block pressable"
              style={{ height: '52px' }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : 'Kaydet'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
