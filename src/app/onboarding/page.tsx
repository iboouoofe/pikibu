'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Baby, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import { AuthShell, Notice } from '@/components/auth/AuthShell'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [babyName, setBabyName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')

  const handleSubmit = async () => {
    if (!babyName.trim() || !birthDate) {
      setError('Lütfen tüm zorunlu alanları doldurun.')
      return
    }

    setLoading(true)
    setError(null)

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
        const data = await res.json()
        throw new Error(data.error || 'Bir hata oluştu.')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu.')
      setLoading(false)
    }
  }

  // Doğum tarihinden kaç aylık olduğunu hesapla
  const getAgeText = () => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const now = new Date()
    const diffMs = now.getTime() - birth.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    const weeks = Math.floor(diffDays / 7)

    if (months >= 1) return `${months} aylık`
    if (weeks >= 1) return `${weeks} haftalık`
    return 'Yeni doğan'
  }

  const maxDate = new Date().toISOString().split('T')[0]
  const minDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 4).toISOString().split('T')[0]
  const canSubmit = !loading && babyName.trim() && birthDate

  return (
    <AuthShell
      title="Bebeğinizi tanıyalım."
      subtitle="Deneyiminizi kişiselleştirmek için yalnızca birkaç bilgi."
      footer={
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-subtle)' }}>
          Bu bilgileri daha sonra Ayarlar’dan güncelleyebilirsiniz.
        </p>
      }
    >
      {error && <Notice tone="error">{error}</Notice>}

      <label className="label" htmlFor="baby-name">Ad</label>
      <div className="form-group input-icon-wrap">
        <Baby size={18} strokeWidth={1.8} />
        <input
          id="baby-name"
          className="input"
          type="text"
          placeholder="Örn. Zeynep"
          value={babyName}
          onChange={(e) => setBabyName(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label className="label" htmlFor="baby-birthdate">Doğum tarihi</label>
        {birthDate && (
          <span className="animate-fade-in" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, paddingRight: '4px' }}>
            {getAgeText()}
          </span>
        )}
      </div>
      <div className="form-group input-icon-wrap">
        <Calendar size={18} strokeWidth={1.8} />
        <input
          id="baby-birthdate"
          className="input"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={maxDate}
          min={minDate}
        />
      </div>

      <label className="label">Cinsiyet <span style={{ color: 'var(--text-subtle)' }}>· isteğe bağlı</span></label>
      <div className="segmented" style={{ marginBottom: '32px' }} role="radiogroup" aria-label="Cinsiyet">
        {[
          { value: 'female', label: 'Kız' },
          { value: 'male', label: 'Erkek' },
        ].map((opt) => (
          <button
            key={opt.value}
            id={`gender-${opt.value}`}
            type="button"
            role="radio"
            aria-checked={gender === opt.value}
            data-active={gender === opt.value}
            onClick={() => setGender(gender === opt.value ? '' : opt.value as 'male' | 'female')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        id="onboarding-submit"
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="btn btn-primary btn-block pressable"
        style={{ height: '54px' }}
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Kaydediliyor</>
        ) : (
          <>Başlayalım <ArrowRight size={18} /></>
        )}
      </button>
    </AuthShell>
  )
}
