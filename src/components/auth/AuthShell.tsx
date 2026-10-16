import Link from 'next/link'

/** Minimal brand mark used across auth & onboarding screens. */
export function BrandMark({ size = 56 }: { size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size, borderRadius: size * 0.28,
        background: 'var(--ink)', color: 'var(--ink-contrast)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="9" cy="11" r="1.3" fill="currentColor" />
        <circle cx="15" cy="11" r="1.3" fill="currentColor" />
        <path d="M9 15.2c1.6 1.3 4.4 1.3 6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: 'absolute', top: '-180px', left: '50%', transform: 'translateX(-50%)',
        width: '560px', height: '420px', borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(41,151,255,0.16), rgba(94,92,230,0.08) 55%, transparent)',
        filter: 'blur(10px)', pointerEvents: 'none', animation: 'glow 8s ease-in-out infinite',
      }} />

      <div style={{
        position: 'relative', flex: 1, width: '100%', maxWidth: '400px', margin: '0 auto',
        padding: 'calc(env(safe-area-inset-top, 0px) + 64px) 24px 40px',
        display: 'flex', flexDirection: 'column',
      }}>
        <Link href="/" aria-label="Pikibu" style={{ alignSelf: 'flex-start', marginBottom: '36px' }}>
          <BrandMark />
        </Link>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.08 }}>{title}</h1>
          {subtitle && (
            <p style={{ marginTop: '10px', fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '-0.015em', lineHeight: 1.45 }}>{subtitle}</p>
          )}
        </div>
        <div>{children}</div>
        {footer && <div style={{ marginTop: 'auto', paddingTop: '32px' }}>{footer}</div>}
      </div>
    </div>
  )
}

export function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '28px 0' }}>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--border-medium)' }} />
      <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>{label}</span>
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
        height: '54px', background: 'var(--bg-surface)', color: 'var(--text-primary)',
        border: '0.5px solid var(--border-medium)', gap: '10px', fontWeight: 500,
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
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '14px 16px', borderRadius: '14px', marginBottom: '20px',
      background: 'var(--bg-surface)', border: '0.5px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginTop: '6px', flexShrink: 0 }} />
      <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.45 }}>{children}</span>
    </div>
  )
}
