'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Lock, Check, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AccountSettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setEmail(user.email || '')
          setName(user.user_metadata?.name || user.email?.split('@')[0] || 'Ebeveyn')
        } else {
          // Fallback if local/offline
          const localEmail = localStorage.getItem('pikibu_user_email') || 'ebeveyn@pikibu.app'
          const localName = localStorage.getItem('pikibu_user_name') || 'Pikibu Ebeveyni'
          setEmail(localEmail)
          setName(localName)
        }
      } catch (e) {
        console.error('Error loading account:', e)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const updateData: any = { data: { name } }
      if (password.trim().length >= 6) {
        updateData.password = password.trim()
      }

      const { error: updateError } = await supabase.auth.updateUser(updateData)
      if (updateError) {
        console.warn('Supabase updateUser warning:', updateError.message)
      }

      localStorage.setItem('pikibu_user_name', name)
      setSuccess(true)
      setPassword('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err?.message || 'Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      <div style={{
        background: 'var(--bg-surface)', padding: '52px 20px 20px',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', gap: '16px'
      }}>
        <Link href="/settings" style={{ color: 'var(--text-primary)' }} aria-label="Geri">
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Hesap Bilgileri</h1>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '520px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <p>Hesap bilgileri yükleniyor...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            
            {error && (
              <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {success && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(74,222,128,0.12)', color: 'var(--sage-dark)', fontSize: '14px', marginBottom: '16px' }}>
                <Check size={16} strokeWidth={2.5} /> Hesap bilgileriniz başarıyla güncellendi!
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <User size={16} /> Ad Soyad
              </label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-raised)', color: 'var(--text-primary)', fontSize: '15px' }} 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <Mail size={16} /> E-posta Adresi
              </label>
              <input 
                type="email" 
                disabled
                value={email} 
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-raised)', color: 'var(--text-muted)', fontSize: '15px', opacity: 0.8 }} 
              />
              <span style={{ fontSize: '12px', color: 'var(--text-subtle)', display: 'block', marginTop: '4px' }}>
                E-posta adresi güvenlik nedeniyle değiştirilemez.
              </span>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <Lock size={16} /> Yeni Şifre
              </label>
              <input 
                type="password" 
                placeholder="Değiştirmek istemiyorsanız boş bırakın (min 6 karakter)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-raised)', color: 'var(--text-primary)', fontSize: '15px' }} 
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-block pressable"
              style={{ height: '52px', justifyContent: 'center' }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : 'Değişiklikleri Kaydet'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
