'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Moon, Utensils, Syringe, Brain, Plus, Grid2x2 } from 'lucide-react'
import { useState } from 'react'
import QuickLogSheet from './QuickLogSheet'

const navItems = [
  { href: '/dashboard', icon: House, label: 'Bugün' },
  { href: '/sleep', icon: Moon, label: 'Uyku' },
  { href: '/feeding', icon: Utensils, label: 'Beslenme' },
  { href: '/leaps', icon: Brain, label: 'Ataklar' },
  { href: '/health', icon: Syringe, label: 'Sağlık' },
  { href: '/tools', icon: Grid2x2, label: 'Araçlar' },
]

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: typeof House; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '3px', textDecoration: 'none', flex: 1, height: '100%',
        color: active ? 'var(--text-primary)' : 'var(--text-subtle)',
        transition: 'color 200ms var(--ease-out)',
        opacity: 1,
      }}
    >
      <Icon size={22} strokeWidth={active ? 2.2 : 1.7} />
      <span style={{ fontSize: '10px', fontWeight: active ? 600 : 500, letterSpacing: '-0.005em' }}>{label}</span>
    </Link>
  )
}

export default function AppBottomNav() {
  const pathname = usePathname()
  const [showQuickLog, setShowQuickLog] = useState(false)

  const leftItems = navItems.slice(0, 3)
  const rightItems = navItems.slice(3)

  return (
    <>
      <nav
        aria-label="Ana gezinme"
        style={{
          position: 'fixed',
          left: '12px', right: '12px',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
          zIndex: 50,
          maxWidth: '520px',
          margin: '0 auto',
          background: 'var(--bg-glass)',
          backdropFilter: 'saturate(180%) blur(24px)',
          WebkitBackdropFilter: 'saturate(180%) blur(24px)',
          border: '0.5px solid var(--border-medium)',
          borderRadius: '26px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: '64px', padding: '0 6px' }}>
          {leftItems.map((item) => (
            <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
          ))}

          <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0, padding: '0 6px' }}>
            <button
              id="quick-log-fab"
              onClick={() => setShowQuickLog(true)}
              aria-label="Hızlı kayıt ekle"
              className="nav-fab"
              style={{ width: '48px', height: '48px' }}
            >
              <Plus size={24} strokeWidth={2.2} />
            </button>
          </div>

          {rightItems.map((item) => (
            <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
          ))}
        </div>
      </nav>

      {showQuickLog && <QuickLogSheet onClose={() => setShowQuickLog(false)} />}
    </>
  )
}
