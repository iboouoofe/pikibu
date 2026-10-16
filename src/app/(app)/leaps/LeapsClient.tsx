'use client'

import { useState } from 'react'
import { Zap, Sun, CloudRain, ChevronRight, Bell, BellRing, Sparkles, Lightbulb, X, Check } from 'lucide-react'

// Helper to safely parse strings / JSON / arrays without crashing
function parseItems(val: any, fallback: string[] = []): string[] {
  if (Array.isArray(val)) return val.filter(Boolean)
  if (!val || typeof val !== 'string' || val.trim() === '...') return fallback
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) return parsed.filter(Boolean)
  } catch {}
  const items = val.split(/[;\n•]/).map(s => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
  return items.length > 0 ? items : fallback
}

import { COMPLETE_LEAPS } from '@/lib/leapsData'

interface LeapsClientProps {
  dbLeaps: any[]
  initialBabyWeeks?: number
  initialBabyName?: string
}

export default function LeapsClient({
  dbLeaps,
  initialBabyWeeks = 16,
  initialBabyName = 'Bebeğiniz'
}: LeapsClientProps) {
  const babyWeeks = initialBabyWeeks
  const babyName = initialBabyName

  // Merge COMPLETE_LEAPS with any DB customizations
  const leaps = COMPLETE_LEAPS.map(fallbackLeap => {
    const dbMatch = Array.isArray(dbLeaps) ? dbLeaps.find(d => Number(d.id) === fallbackLeap.id) : null
    const title = dbMatch?.titleTr || dbMatch?.title || fallbackLeap.titleTr
    const description = (dbMatch?.descriptionTr && dbMatch.descriptionTr !== '...') 
      ? dbMatch.descriptionTr 
      : fallbackLeap.descriptionTr
    const symptoms = dbMatch?.symptomsTr && dbMatch.symptomsTr !== '...'
      ? parseItems(dbMatch.symptomsTr, fallbackLeap.symptoms)
      : fallbackLeap.symptoms
    const skills = dbMatch?.cognitiveSkillsTr && dbMatch.cognitiveSkillsTr !== '...'
      ? parseItems(dbMatch.cognitiveSkillsTr, fallbackLeap.skills)
      : fallbackLeap.skills
    const tips = dbMatch?.soothingTipsTr && dbMatch.soothingTipsTr !== '...'
      ? dbMatch.soothingTipsTr
      : fallbackLeap.tips

    const startWeek = dbMatch?.startWeek ?? fallbackLeap.startWeek
    const endWeek = dbMatch?.endWeek ?? fallbackLeap.endWeek
    const phase: 'past' | 'active' | 'future' =
      babyWeeks > endWeek ? 'past' : babyWeeks >= startWeek ? 'active' : 'future'

    return {
      id: fallbackLeap.id,
      title,
      startWeek,
      endWeek,
      description,
      symptoms,
      skills,
      tips,
      phase,
    }
  })

  const [selected, setSelected] = useState<number | null>(null)
  const [showDetail, setShowDetail] = useState<number | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const activeLeap = leaps.find(l => l.phase === 'active') || leaps.find(l => l.phase === 'future') || leaps[0]
  const detailLeap = showDetail != null ? leaps.find(l => Number(l.id) === Number(showDetail)) : null
  const completedCount = leaps.filter(l => l.phase === 'past').length

  const handleOpenDetail = (id: number) => {
    setShowDetail(id)
  }

  const handleToggleRow = (id: number) => {
    setSelected(prev => (prev === id ? null : id))
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Large title header */}
      <header style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 28px) 20px 8px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <span className="eyebrow">{babyName} · {babyWeeks}. hafta</span>
          <button
            type="button"
            id="leaps-notify-toggle"
            onClick={() => setNotificationsEnabled(prev => !prev)}
            aria-label="Atak bildirimleri"
            aria-pressed={notificationsEnabled}
            className="pressable"
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: notificationsEnabled ? 'var(--ink)' : 'var(--bg-surface)',
              color: notificationsEnabled ? 'var(--ink-contrast)' : 'var(--text-primary)',
              border: '0.5px solid var(--border-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', touchAction: 'manipulation',
            }}
          >
            {notificationsEnabled ? <BellRing size={17} strokeWidth={1.8} /> : <Bell size={17} strokeWidth={1.8} />}
          </button>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>Ataklar</h1>
        <p style={{ marginTop: '6px', fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '-0.015em' }}>
          10 zihinsel sıçramadan {completedCount} tanesi tamamlandı
        </p>
      </header>

      {/* Main content container */}
      <div style={{ padding: '20px 16px 120px', maxWidth: '520px', margin: '0 auto' }}>

        {/* Active / Current leap hero */}
        {activeLeap && (
          <section className="sweetspot-banner" style={{ marginBottom: '32px', position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {activeLeap.id}. Atak · {activeLeap.startWeek}–{activeLeap.endWeek}. Hafta
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600,
                  color: '#fff', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '100px'
                }}>
                  {activeLeap.phase === 'active' ? (
                    <><CloudRain size={13} /> Şu an aktif</>
                  ) : activeLeap.phase === 'future' ? (
                    <><Sun size={13} /> Yaklaşıyor</>
                  ) : (
                    <><Check size={13} /> Tamamlandı</>
                  )}
                </span>
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.035em', color: '#fff', marginBottom: '10px' }}>
                {activeLeap.title}
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.55, marginBottom: '22px' }}>
                {activeLeap.description} Bu dönemde {babyName} daha fazla şefkat ve sabra ihtiyaç duyabilir.
              </p>

              {/* Phase progress visual */}
              <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '10px' }}>
                <div style={{ flex: 2, background: '#fff', borderRadius: '4px' }} />
                <div style={{ flex: 3, background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }} />
                <div style={{ flex: 2, background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '24px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fff' }}><CloudRain size={11} /> Fırtınalı</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={11} /> Beceriler</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Sun size={11} /> Güneşli</span>
              </div>

              <button
                type="button"
                id="leap-detail-btn"
                className="btn btn-block pressable"
                style={{
                  height: '52px',
                  background: '#FFFFFF',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 10,
                  touchAction: 'manipulation',
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleOpenDetail(Number(activeLeap.id))
                }}
              >
                Rehberi görüntüle
              </button>
            </div>
          </section>
        )}

        {/* Timeline */}
        <div className="section-header" style={{ marginBottom: '14px' }}>
          <span className="section-title">10 Zihinsel Sıçrama</span>
        </div>

        <div className="list-group">
          {leaps.map((leap) => {
            const isSelected = selected === leap.id
            const isActive = leap.phase === 'active'
            const isPast = leap.phase === 'past'
            return (
              <div key={leap.id} style={{ borderTop: leap.id === leaps[0]?.id ? 'none' : '0.5px solid var(--border-light)' }}>
                <button
                  type="button"
                  id={`leap-row-${leap.id}`}
                  onClick={() => handleToggleRow(leap.id)}
                  aria-expanded={isSelected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    touchAction: 'manipulation',
                    pointerEvents: 'auto',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    background: isActive ? 'var(--ink)' : isPast ? 'var(--bg-raised)' : 'transparent',
                    border: isActive || isPast ? 'none' : '1px solid var(--border-medium)',
                    color: isActive ? 'var(--ink-contrast)' : isPast ? 'var(--text-subtle)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    boxShadow: isActive ? '0 0 0 4px var(--accent-soft)' : 'none',
                  }}>
                    {isPast ? <Check size={16} strokeWidth={2.5} color="var(--sage-dark)" /> : leap.id}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.015em', color: isPast ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {leap.title}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: '100px' }}>
                          Aktif
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                      {leap.startWeek}–{leap.endWeek}. hafta
                    </div>
                  </div>
                  <ChevronRight size={17} color="var(--text-subtle)" style={{ flexShrink: 0, transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform var(--transition-base)' }} />
                </button>

                {isSelected && (
                  <div className="animate-slide-down" style={{ padding: '0 16px 18px 64px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '14px' }}>
                      {leap.description}
                    </p>
                    <button
                      type="button"
                      id={`leap-read-${leap.id}`}
                      className="btn btn-secondary pressable"
                      style={{ padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', touchAction: 'manipulation', pointerEvents: 'auto' }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleOpenDetail(leap.id)
                      }}
                    >
                      Detayları oku
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Sheet Modal */}
      {detailLeap && (
        <div
          className="modal-overlay"
          style={{ justifyContent: 'center', zIndex: 9999, pointerEvents: 'auto' }}
          onClick={() => setShowDetail(null)}
          role="dialog"
          aria-modal="true"
          aria-label={detailLeap.title}
        >
          <div
            className="bottom-sheet"
            style={{ maxWidth: '560px', background: 'var(--bg-base)', pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sheet-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <div>
                <span className="eyebrow">{detailLeap.id}. Atak · {detailLeap.startWeek}–{detailLeap.endWeek}. hafta</span>
                <h2 style={{ fontSize: '26px', marginTop: '6px', letterSpacing: '-0.025em' }}>{detailLeap.title}</h2>
              </div>
              <button
                type="button"
                id="leap-detail-close"
                onClick={() => setShowDetail(null)}
                aria-label="Kapat"
                style={{
                  width: '36px', height: '36px', border: 'none', borderRadius: '50%',
                  background: 'var(--bg-raised)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
                  touchAction: 'manipulation', pointerEvents: 'auto',
                }}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.55, marginBottom: '24px' }}>
              {detailLeap.description}
            </p>

            {/* Symptoms Card */}
            <div className="card" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudRain size={16} color="#fff" />
                </div>
                <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.015em' }}>Fırtına Belirtileri</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detailLeap.symptoms.map((s: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lavender-dark)', marginTop: '7px', flexShrink: 0 }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills Card */}
            <div className="card" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.015em' }}>Yeni Beceriler</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {detailLeap.skills.map((s: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sage-dark)', marginTop: '7px', flexShrink: 0 }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips Card */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--butter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={16} color="#fff" />
                </div>
                <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.015em' }}>Ebeveynlere Tavsiyeler</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.55 }}>
                {detailLeap.tips}
              </p>
            </div>

            <button
              type="button"
              id="leap-detail-done"
              className="btn btn-primary btn-block pressable"
              style={{ height: '54px', fontWeight: 600, cursor: 'pointer', touchAction: 'manipulation', pointerEvents: 'auto' }}
              onClick={() => setShowDetail(null)}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
