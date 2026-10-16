'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, MailCheck } from 'lucide-react'
import { signup } from '../actions'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, Divider, GoogleButton, Notice } from '@/components/auth/AuthShell'

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterPageInner />
    </Suspense>
  )
}

function RegisterPageInner() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')
  const handleOAuth = async (provider: 'google') => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  // E-posta onay ekranı
  if (success === 'check-email') {
    return (
      <AuthShell
        title="Gelen kutunuzu kontrol edin."
        subtitle="Kayıt olduğunuz adrese bir onay bağlantısı gönderdik. Bağlantıya dokunduktan sonra giriş yapabilirsiniz."
      >
        <div className="card animate-scale-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px', marginBottom: '28px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MailCheck size={22} color="var(--accent)" strokeWidth={1.8} />
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
            Maili göremiyorsanız <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Spam</strong> klasörüne de göz atın.
          </p>
        </div>
        <Link href="/login" id="back-to-login" className="btn btn-primary btn-block" style={{ height: '54px', textDecoration: 'none' }}>
          Giriş sayfasına dön <ArrowRight size={18} />
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Pikibu hesabı oluşturun."
      subtitle="Uyku, beslenme ve gelişim — tek bir sakin yerde."
      footer={
        <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--text-muted)' }}>
          Zaten hesabınız var mı?{' '}
          <Link href="/login" id="go-login" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Giriş yapın
          </Link>
        </p>
      }
    >
      {error && <Notice tone="error">{error}</Notice>}

      <form action={signup}>
        <div className="form-group input-icon-wrap">
          <User size={18} strokeWidth={1.8} />
          <input id="register-name" className="input" type="text" name="name" required autoComplete="name" placeholder="Ad Soyad" aria-label="Ad Soyad" />
        </div>

        <div className="form-group input-icon-wrap">
          <Mail size={18} strokeWidth={1.8} />
          <input id="register-email" className="input" type="email" name="email" required autoComplete="email" placeholder="E-posta" aria-label="E-posta" />
        </div>

        <div className="form-group input-icon-wrap" style={{ marginBottom: '8px' }}>
          <Lock size={18} strokeWidth={1.8} />
          <input id="register-password" className="input" type="password" name="password" required minLength={8} autoComplete="new-password" placeholder="Şifre" aria-label="Şifre" />
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-subtle)', padding: '0 4px', marginBottom: '28px' }}>
          En az 8 karakter kullanın.
        </p>

        <button id="register-submit" type="submit" className="btn btn-primary btn-block pressable" style={{ height: '54px' }}>
          Devam et <ArrowRight size={18} />
        </button>
      </form>

      <Divider label="veya" />

      <GoogleButton label="Google ile devam et" onClick={() => handleOAuth('google')} />
    </AuthShell>
  )
}
