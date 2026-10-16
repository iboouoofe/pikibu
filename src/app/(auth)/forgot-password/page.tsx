'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Graphics */}
      <div style={{ padding: '60px 24px 24px', textAlign: 'center', position: 'relative' }}>
        <Link href="/login" style={{ position: 'absolute', top: '52px', left: '20px', color: 'var(--text-primary)', background: 'var(--bg-surface)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
          <ArrowLeft size={20} />
        </Link>

        <div style={{ width: '80px', height: '80px', background: 'var(--lavender)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(167,139,250,0.3)' }}>
          <span style={{ fontSize: '40px' }}>🔐</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Şifremi Unuttum</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '400px', width: '100%', margin: '0 auto', flex: 1 }}>
        
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!'); 
          window.location.href = '/login';
        }}>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>E-Posta Adresi</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px' }}>
                <Mail size={20} color="var(--text-muted)" />
              </div>
              <input type="email" placeholder="ornek@mail.com" required style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)', fontSize: '16px', outline: 'none' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ justifyContent: 'center', height: '56px', fontSize: '16px', background: 'var(--lavender-dark)', boxShadow: '0 4px 14px rgba(167,139,250,0.3)' }}>
            Bağlantı Gönder <ArrowRight size={20} />
          </button>
        </form>

      </div>
    </div>
  )
}
