'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Crown, Check, Sparkles, Shield, ChevronLeft, Zap,
  Moon, Soup, Brain, Heart, ArrowRight, Loader2
} from 'lucide-react'

export default function PremiumPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly')
  const [subscribing, setSubscribing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async () => {
    setSubscribing(true)
    try {
      // Simulate/trigger plan upgrade
      await new Promise(r => setTimeout(r, 1200))
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (e) {
      console.error(e)
      setSubscribing(false)
    }
  }

  const features = [
    {
      title: 'SweetSpot™ Akıllı Uyku Tahmini',
      desc: 'Bebeğiniz aşırı yorulmadan önce ideal uyku saatini dakika dakika hesaplayın.',
      icon: Moon,
      color: 'var(--lavender)',
    },
    {
      title: 'Sınırsız Beyaz Gürültü & Çoklu Mikser',
      desc: '12 farklı sakinleştirici ses, kesintisiz arka planda çalma ve özel mikser modu.',
      icon: Zap,
      color: 'var(--coral)',
    },
    {
      title: '10 Zihinsel Sıçrama & Atak Rehberi',
      desc: 'Fırtınalı ve güneşli günler takvimi, yeni beceriler ve uzman sakinleştirme önerileri.',
      icon: Brain,
      color: 'var(--butter)',
    },
    {
      title: 'Özel Aşı Takvimi & Hatırlatıcılar',
      desc: 'Menenjit B, Rotavirüs ve özel aşıların takip ve doktor soru listeleri.',
      icon: Shield,
      color: 'var(--sage-dark)',
    },
    {
      title: 'BLW & 100+ Bebek Beslenme Tarifi',
      desc: 'Ayına uygun püreler, parmak gıdalar ve alerjen takip günlüğü.',
      icon: Soup,
      color: 'var(--pink)',
    },
    {
      title: 'PDF Sağlık & Gelişim Raporları',
      desc: 'Doktor randevuları için tek dokunuşla uyku, beslenme ve büyüme dökümü alın.',
      icon: Heart,
      color: '#EF4444',
    },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: '80px' }}>
      {/* Top navigation */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 0px) + 16px) 20px 12px',
        maxWidth: '520px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          color: 'var(--text-primary)', textDecoration: 'none', fontSize: '15px', fontWeight: 600
        }}>
          <ChevronLeft size={20} /> Geri
        </Link>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--coral)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ⭐ Pikibu Premium
        </span>
      </div>

      <div style={{ padding: '12px 16px', maxWidth: '520px', margin: '0 auto' }}>

        {/* Hero header */}
        <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '10px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '22px',
            background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 10px 25px rgba(245,158,11,0.35)'
          }}>
            <Crown size={32} color="#fff" />
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '8px' }}>
            Bebeğiniz İçin En İyisi
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto' }}>
            Bilinçli ebeveynlik için tasarlanmış tüm yapay zeka ve uzman araçlarına sınırsız erişin.
          </p>
        </div>

        {/* Pricing selector */}
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)', padding: '6px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '20px'
        }}>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '12px 10px', borderRadius: '14px', border: 'none',
              background: billingCycle === 'yearly' ? 'var(--ink)' : 'transparent',
              color: billingCycle === 'yearly' ? 'var(--ink-contrast)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute', top: '-10px', right: '10px',
              background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
              color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 6px',
              borderRadius: '6px', letterSpacing: '0.04em'
            }}>
              %50 İNDİRİM
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Yıllık Plan</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>₺41,50 / ay</div>
          </button>

          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '12px 10px', borderRadius: '14px', border: 'none',
              background: billingCycle === 'monthly' ? 'var(--ink)' : 'transparent',
              color: billingCycle === 'monthly' ? 'var(--ink-contrast)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Aylık Plan</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>₺79,00 / ay</div>
          </button>
        </div>

        {/* Main CTA button */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={handleSubscribe}
            disabled={subscribing || success}
            className="btn btn-primary btn-block pressable"
            style={{
              height: '58px', fontSize: '17px', fontWeight: 800,
              background: success
                ? 'var(--success)'
                : 'linear-gradient(135deg, #0071E3, #2997FF)',
              boxShadow: '0 8px 25px rgba(0,113,227,0.35)',
              justifyContent: 'center', gap: '8px'
            }}
          >
            {subscribing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : success ? (
              <><Check size={20} strokeWidth={3} /> Premium Aktif Edildi!</>
            ) : (
              <>
                <Sparkles size={18} />
                {billingCycle === 'yearly' ? '7 Gün Ücretsiz Dene (Sonra ₺499/yıl)' : 'Aylık Aboneliği Başlat'}
              </>
            )}
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-subtle)', marginTop: '8px' }}>
            İstediğiniz zaman tek dokunuşla iptal edebilirsiniz. Taahhüt yok.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '14px' }}>
            PREMIUM AVANTAJLARI
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)', padding: '16px',
                  display: 'flex', alignItems: 'flex-start', gap: '14px'
                }}
              >
                <div style={{
                  width: '38px', height: '38px', borderRadius: '12px',
                  background: `${f.color}15`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0
                }}>
                  <f.icon size={19} color={f.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div style={{
          background: 'rgba(74,222,128,0.1)', borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(74,222,128,0.25)', padding: '18px', textAlign: 'center'
        }}>
          <Shield size={24} color="var(--sage-dark)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--sage-dark)' }}>
            %100 Memnuniyet Güvencesi
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Deneme süresi boyunca hiçbir ücret tahsil edilmez. Verileriniz KVKK ve tıbbi gizlilik standartlarında korunur.
          </div>
        </div>

      </div>
    </div>
  )
}
