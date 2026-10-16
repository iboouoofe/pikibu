import Link from 'next/link'

/** Radiant, warm and iconic Pikibu brand mark */
export function BrandMark({ size = 58 }: { size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        background: 'linear-gradient(135deg, #FF6B8B 0%, #FF8E53 50%, #FFA07A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 14px 32px -6px rgba(255, 107, 139, 0.48), 0 6px 16px -3px rgba(255, 142, 83, 0.35)',
        position: 'relative',
        overflow: 'hidden',
        border: '1.5px solid rgba(255, 255, 255, 0.5)',
        flexShrink: 0,
      }}
    >
      {/* Gloss highlight reflection */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '48%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0))',
          borderRadius: `${size * 0.32}px ${size * 0.32}px 0 0`,
          pointerEvents: 'none',
        }}
      />

      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 1 }}>
        {/* Baby head */}
        <circle cx="12" cy="12.5" r="8.5" fill="rgba(255, 255, 255, 0.15)" stroke="#FFFFFF" strokeWidth="2" />
        {/* Baby hair curl */}
        <path d="M12 4C11.5 2.5 13 1.8 13.8 2.5C14.4 3.1 13.8 4 12 4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        {/* Joyful closed/happy eyes */}
        <path d="M8 11.5C8.8 10.6 10 10.6 10.5 11.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <path d="M13.5 11.5C14 10.6 15.2 10.6 16 11.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="7.2" cy="13.8" r="1.6" fill="rgba(255, 255, 255, 0.45)" />
        <circle cx="16.8" cy="13.8" r="1.6" fill="rgba(255, 255, 255, 0.45)" />
        {/* Sweet baby smile */}
        <path d="M9.5 15C10.5 16.5 13.5 16.5 14.5 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function AuthShell({
  title, subtitle, children, footer,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Warm ambient multi-color lighting */}
      <div aria-hidden style={{
        position: 'absolute',
        top: '-160px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '640px',
        height: '480px',
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,107,139,0.20), rgba(255,142,83,0.12) 40%, rgba(94,92,230,0.06) 70%, transparent)',
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div aria-hidden style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,194,102,0.15), transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: 'calc(env(safe-area-inset-top, 0px) + 32px) 20px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Radiant Brand Header: Logo + "Pikibu" text + Badge */}
        <Link
          href="/"
          aria-label="Pikibu Ana Sayfa"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            textDecoration: 'none',
            marginBottom: '28px',
            alignSelf: 'flex-start',
          }}
        >
          <BrandMark size={58} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '30px',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #FF5388 0%, #FF7E67 55%, #FF9F0A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                lineHeight: 1.1,
              }}>
                Pikibu
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                padding: '3px 8px',
                borderRadius: '9999px',
                background: 'rgba(255, 83, 136, 0.12)',
                color: '#FF375F',
                border: '1px solid rgba(255, 83, 136, 0.24)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                ✨ Bebek Takibi
              </span>
            </div>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              margin: '3px 0 0',
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}>
              Akıllı Ebeveyn & Uyku Asistanı
            </p>
          </div>
        </Link>

        {/* Floating Card Container */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '26px',
          padding: '28px 24px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                marginTop: '8px',
                fontSize: '15px',
                color: 'var(--text-muted)',
                letterSpacing: '-0.015em',
                lineHeight: 1.45,
                margin: '8px 0 0',
              }}>
                {subtitle}
              </p>
            )}
          </div>

          <div>{children}</div>
        </div>

        {footer && <div style={{ paddingTop: '24px' }}>{footer}</div>}
      </div>
    </div>
  )
}

export function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0' }}>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--border-medium)' }} />
      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-subtle)' }}>{label}</span>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--border-medium)' }} />
    </div>
  )
}

export function GoogleButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      id="google-auth-btn"
      type="button"
      onClick={onClick}
      className="btn btn-block pressable"
      style={{
        height: '50px',
        background: 'var(--bg-raised)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-medium)',
        gap: '10px',
        fontWeight: 500,
        fontSize: '15px',
        borderRadius: '14px',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {label}
    </button>
  )
}

export function Notice({ tone = 'error', children }: { tone?: 'error' | 'warning' | 'success'; children: React.ReactNode }) {
  const color = tone === 'error' ? 'var(--danger)' : tone === 'warning' ? 'var(--butter-dark)' : 'var(--sage-dark)'
  return (
    <div role="alert" className="animate-slide-down" style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px 14px',
      borderRadius: '14px',
      marginBottom: '18px',
      background: 'rgba(255, 59, 48, 0.08)',
      border: '1px solid rgba(255, 59, 48, 0.2)',
    }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginTop: '6px', flexShrink: 0 }} />
      <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.45 }}>{children}</span>
    </div>
  )
}
