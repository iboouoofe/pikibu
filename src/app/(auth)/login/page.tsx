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
    : errorCode
    ? errorCode
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
      title="Tekrar hoş geldiniz."
      subtitle="Bebeğinizin gelişimini takip etmeye kaldığınız yerden devam edin."
      footer={
        <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--text-muted)' }}>
          Hesabınız yok mu?{' '}
          <Link href="/register" id="go-register" style={{ color: 'var(--accent)', fontWeight: 500 }}>
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
          <input id="login-email" className="input" type="email" name="email" required autoComplete="email" placeholder="E-posta" aria-label="E-posta" defaultValue="demo@pikibu.app" />
        </div>

        <div className="form-group input-icon-wrap">
          <Lock size={18} strokeWidth={1.8} />
          <input id="login-password" className="input" type="password" name="password" required autoComplete="current-password" placeholder="Şifre" aria-label="Şifre" defaultValue="123456" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '4px 0 28px' }}>
          <Link href="/forgot-password" style={{ fontSize: '14px', color: 'var(--accent)' }}>
            Şifrenizi mi unuttunuz?
          </Link>
        </div>

        <button id="login-submit" type="submit" className="btn btn-primary btn-block pressable" style={{ height: '54px' }}>
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
              background: 'rgba(0,113,227,0.08)',
              color: 'var(--coral)',
              border: '1px solid rgba(0,113,227,0.2)',
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

