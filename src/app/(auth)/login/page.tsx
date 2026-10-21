'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { login, quickDemoLogin } from '../actions'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, Divider, GoogleButton, Notice } from '@/components/auth/AuthShell'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error')

  const errorMessage = errorCode === 'email_not_confirmed'
    ? 'E-posta adresinizi henüz onaylamadınız. Lütfen gelen kutunuzu kontrol edin.'
    : errorCode === 'invalid_credentials'
    ? 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.'
    : errorCode === 'missing_fields'
    ? 'Lütfen e-posta adresinizi ve şifrenizi girin.'
    : errorCode === 'google_auth_failed'
    ? 'Google ile giriş tamamlanamadı. Lütfen hesabınızı kontrol edin veya e-posta ile giriş yapın.'
    : errorCode
    ? decodeURIComponent(errorCode)
    : null

  const handleOAuth = async (provider: 'google') => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <AuthShell
      title="Giriş Yapın 🧸"
      subtitle="Bebeğinizin uyku, beslenme ve atak haftalarını takip edin."
      footer={
        <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--text-muted)' }}>
          Hesabınız yok mu?{' '}
          <Link href="/register" id="go-register" style={{ color: '#FF375F', fontWeight: 600 }}>
            Hesap oluşturun
          </Link>
        </p>
      }
    >
      {errorMessage && (
        <Notice tone={errorCode === 'email_not_confirmed' ? 'warning' : 'error'}>{errorMessage}</Notice>
      )}

      <form action={login}>
        <div className="form-group input-icon-wrap">
          <Mail size={18} strokeWidth={1.8} />
          <input id="login-email" className="input" type="email" name="email" required autoComplete="email" placeholder="E-posta adresiniz" aria-label="E-posta" />
        </div>

        <div className="form-group input-icon-wrap">
          <Lock size={18} strokeWidth={1.8} />
          <input id="login-password" className="input" type="password" name="password" required autoComplete="current-password" placeholder="Şifreniz" aria-label="Şifre" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '4px 0 24px' }}>
          <Link href="/forgot-password" style={{ fontSize: '14px', color: '#FF375F', fontWeight: 500 }}>
            Şifrenizi mi unuttunuz?
          </Link>
        </div>

        <button
          id="login-submit"
          type="submit"
          className="btn btn-primary btn-block pressable"
          style={{
            height: '52px',
            background: 'linear-gradient(135deg, #FF6B8B 0%, #FF5388 50%, #E63956 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: 600,
            boxShadow: '0 8px 20px -4px rgba(255, 83, 136, 0.4)',
          }}
        >
          Giriş yap <ArrowRight size={18} />
        </button>
      </form>

      <div style={{ marginTop: '12px' }}>
        <form action={quickDemoLogin}>
          <button
            type="submit"
            className="btn btn-block pressable"
            style={{
              height: '48px',
              background: 'linear-gradient(135deg, rgba(255, 107, 139, 0.12) 0%, rgba(255, 142, 83, 0.12) 100%)',
              color: '#FF375F',
              border: '1.5px solid rgba(255, 83, 136, 0.28)',
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            Hemen Keşfet & Test Et 👶
          </button>
        </form>
      </div>

      <Divider label="veya" />

      <GoogleButton label="Google ile devam et" onClick={() => handleOAuth('google')} />
    </AuthShell>
  )
}

