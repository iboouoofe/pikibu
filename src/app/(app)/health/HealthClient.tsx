'use client'

import React, { useState, useEffect } from 'react'
import { Check, Clock, ChevronRight, AlertCircle, Bell, Calendar, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react'
import { COMPLETE_VACCINES } from '@/lib/vaccinesData'


export default function HealthClient({ dbVaccines, baby }: { dbVaccines: any[], baby: any }) {
  const [activeTab, setActiveTab] = useState<'vaccines' | 'allSchedule' | 'health'>('vaccines')
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Calculate age accurately
  const birthDate = baby?.birthDate ? new Date(baby.birthDate) : new Date(Date.now() - 1000 * 60 * 60 * 24 * 120)
  const diffMs = Math.max(0, new Date().getTime() - birthDate.getTime())
  const babyDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const babyMonths = Math.floor(babyDays / 30.4375)

  const storageKey = `pikibu_completed_vaccines_${baby?.id || 'default'}`

  // Load completed vaccines on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCompletedIds(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Error loading completed vaccines from storage:', e)
    }
    setMounted(true)
  }, [storageKey])

  // Save to localStorage whenever completedIds changes
  const toggleVaccine = (vaccineId: string) => {
    setCompletedIds(prev => {
      const next = prev.includes(vaccineId)
        ? prev.filter(id => id !== vaccineId)
        : [...prev, vaccineId]
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch (e) {
        console.error('Error saving vaccine state:', e)
      }
      return next
    })
  }

  // Use DB vaccines if provided, else complete pediatric calendar
  const vaccines = Array.isArray(dbVaccines) && dbVaccines.length > 0 ? dbVaccines : COMPLETE_VACCINES

  // Mark all past vaccines as completed with one tap
  const markPastAsCompleted = () => {
    const pastIds = vaccines.filter(v => v.ageMonths < babyMonths).map(v => v.id)
    const combined = Array.from(new Set([...completedIds, ...pastIds]))
    setCompletedIds(combined)
    try {
      localStorage.setItem(storageKey, JSON.stringify(combined))
    } catch (e) {
      console.error('Error saving past vaccines:', e)
    }
  }

  // Vaccines categorization based on baby's current age:
  // 1. Current / Next upcoming window (The next month that has scheduled vaccines >= babyMonths or strictly closest)
  const remainingVaccines = vaccines.filter(v => !completedIds.includes(v.id))
  
  // Target month for upcoming vaccines:
  const upcomingCandidates = remainingVaccines.filter(v => v.ageMonths >= babyMonths)
  const nextTargetMonth = upcomingCandidates.length > 0 
    ? Math.min(...upcomingCandidates.map(v => v.ageMonths))
    : (vaccines.length > 0 ? Math.max(...vaccines.map(v => v.ageMonths)) : 18)

  // Vaccines due in the current/next target month
  const upcoming = remainingVaccines.filter(v => v.ageMonths === nextTargetMonth)

  // Incomplete vaccines from past months (strictly before babyMonths and not in upcoming)
  const pastIncomplete = remainingVaccines.filter(v => v.ageMonths < babyMonths && v.ageMonths !== nextTargetMonth)

  // Completed vaccines
  const completed = vaccines.filter(v => completedIds.includes(v.id))

  // Future scheduled vaccines (strictly after nextTargetMonth)
  const future = remainingVaccines.filter(v => v.ageMonths > nextTargetMonth)

  // Month-by-month grouping for full schedule tab
  const monthsList = Array.from(new Set(vaccines.map(v => v.ageMonths))).sort((a, b) => a - b)

  const getMonthLabel = (m: number) => {
    if (m === 0) return 'Doğumda (0. Ay)'
    if (m === 12) return '12. Ay (1 Yaş)'
    if (m === 18) return '18. Ay (1.5 Yaş)'
    if (m === 24) return '24. Ay (2 Yaş)'
    return `${m}. Ay`
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-surface)', padding: '52px 20px 0', borderBottom: '1px solid var(--border-light)' }}>
        <h1 style={{ marginBottom: '4px' }}>Sağlık & Aşı 💉</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
          {baby?.name || 'Bebeğiniz'} · <strong style={{ color: 'var(--text-primary)' }}>{babyMonths} aylık</strong> ({babyDays} günlük)
        </p>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {[
            { id: 'vaccines', label: 'Sıradaki & Özet' },
            { id: 'allSchedule', label: 'Tüm Aşı Takvimi' },
            { id: 'health', label: 'Sağlık Günlüğü' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 16px', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--coral)' : 'transparent'}`,
                color: activeTab === tab.id ? 'var(--coral)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: '520px', margin: '0 auto' }}>
        
        {/* TAB 1: SIRADAKİ & ÖZET */}
        {activeTab === 'vaccines' && (
          <>
            {/* Progress summary card */}
            <div style={{
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)', padding: '20px', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '28px', color: 'var(--sage-dark)' }}>
                    {completed.length}/{vaccines.length}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tamamlanan Aşı</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '28px', color: 'var(--coral)' }}>
                    {upcoming.length}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {getMonthLabel(nextTargetMonth)} Aşısı
                  </div>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill progress-fill-sage"
                  style={{ width: `${vaccines.length > 0 ? (completed.length / vaccines.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Quick action for past vaccines if baby is older and past ones are uncompleted */}
            {pastIncomplete.length > 0 && (
              <div style={{
                background: 'rgba(0,113,227,0.08)', borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(0,113,227,0.20)', padding: '16px', marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldCheck size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent)' }}>Önceki Aylar</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '12px' }}>
                  {baby?.name || 'Bebeğiniz'} şu an {babyMonths} aylık. Önceki aylara ({pastIncomplete.map(v => v.ageMonths).filter((v, i, a) => a.indexOf(v) === i).join(', ')}. ay) ait {pastIncomplete.length} adet aşı yapıldıysa tek dokunuşla tamamlandı olarak işaretleyebilirsiniz:
                </p>
                <button
                  type="button"
                  onClick={markPastAsCompleted}
                  className="btn btn-secondary btn-block pressable"
                  style={{ height: '40px', fontSize: '13px', fontWeight: 600, gap: '6px' }}
                >
                  <Check size={16} /> Önceki Ayların Aşılarını Tamamlandı Yap
                </button>
              </div>
            )}

            {/* UPCOMING VACCINES (Next scheduled window) */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="section-title">⏰ Sıradaki / Yaklaşan Aşılar ({getMonthLabel(nextTargetMonth)})</span>
              <span className="badge badge-coral" style={{ fontSize: '11px', fontWeight: 700 }}>
                {upcoming.length} Aşı
              </span>
            </div>

            {upcoming.length === 0 ? (
              <div style={{
                padding: '24px', textAlign: 'center', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '24px'
              }}>
                <CheckCircle2 size={32} color="var(--sage)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Bu dönem aşıları tamamlandı!</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bir sonraki aşı dönemi için takvimi inceleyebilirsiniz.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {upcoming.map(v => (
                  <div
                    key={v.id}
                    style={{
                      background: 'rgba(248,113,113,0.06)', borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(248,113,113,0.22)', padding: '16px',
                      display: 'flex', gap: '14px', alignItems: 'center',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleVaccine(v.id)}
                      className="pressable"
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        border: '2px solid var(--coral)', background: 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                      }}
                      title="Yapıldı olarak işaretle"
                    >
                      <Check size={16} color="transparent" />
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{v.nameTr || v.name}</span>
                        <span className="badge badge-coral" style={{ fontSize: '10px' }}>{v.ageMonths}. Ay</span>
                      </div>
                      {v.description && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{v.description}</div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleVaccine(v.id)}
                      className="btn btn-secondary pressable"
                      style={{ fontSize: '12px', height: '34px', padding: '0 12px', flexShrink: 0, fontWeight: 600 }}
                    >
                      Yapıldı
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* PAST INCOMPLETE VACCINES (If any) */}
            {pastIncomplete.length > 0 && (
              <>
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <span className="section-title" style={{ color: 'var(--text-muted)' }}>Önceki Aylardan Yapılmamış Görünenler</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {pastIncomplete.map(v => (
                    <div
                      key={v.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleVaccine(v.id)}
                        className="pressable"
                        style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          border: '1.5px solid var(--border-medium)', background: 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', flexShrink: 0,
                        }}
                      >
                        <Check size={14} color="transparent" />
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{v.nameTr || v.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>{v.ageMonths}. Ay aşısı</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleVaccine(v.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Tamamla
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* COMPLETED VACCINES */}
            {completed.length > 0 && (
              <>
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <span className="section-title">Tamamlanan Aşılar ({completed.length})</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {completed.map(v => (
                    <div
                      key={v.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-light)', opacity: 0.85,
                      }}
                    >
                      <div
                        style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          background: 'rgba(74,222,128,0.18)', color: 'var(--sage-dark)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                      >
                        <Check size={15} strokeWidth={2.5} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{v.nameTr || v.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{v.ageMonths}. Ay · Yapıldı</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleVaccine(v.id)}
                        className="pressable"
                        title="İptal et / yapılmadı yap"
                        style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '4px' }}
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* FUTURE VACCINES PREVIEW */}
            {future.length > 0 && (
              <>
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <span className="section-title">Gelecek Dönemler</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {future.slice(0, 4).map(v => (
                    <div
                      key={v.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                        background: 'var(--bg-raised)', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-light)', opacity: 0.6,
                      }}
                    >
                      <Clock size={16} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{v.nameTr || v.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{getMonthLabel(v.ageMonths)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* TAB 2: TÜM AŞI TAKVİMİ (AY AY GÖRÜNÜM) */}
        {activeTab === 'allSchedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '4px' }}>
              T.C. Sağlık Bakanlığı Çocukluk Dönemi Aşı Takvimi ve önerilen aşılar ({baby?.name || 'Bebeğiniz'} şu an <strong>{babyMonths} aylık</strong>):
            </div>

            {monthsList.map(month => {
              const monthVaccines = vaccines.filter(v => v.ageMonths === month)
              const isCurrentPeriod = month === nextTargetMonth || (babyMonths >= month && babyMonths < month + 2)
              const isPast = month < babyMonths && !isCurrentPeriod

              return (
                <div
                  key={month}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: isCurrentPeriod ? '1.5px solid var(--accent)' : '1px solid var(--border-light)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Period Header */}
                  <div style={{
                    padding: '12px 16px',
                    background: isCurrentPeriod ? 'rgba(0,113,227,0.08)' : 'var(--bg-raised)',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>{getMonthLabel(month)}</span>
                      {isCurrentPeriod && (
                        <span className="badge badge-coral" style={{ fontSize: '10px', fontWeight: 700 }}>
                          Şu Anki Dönem
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {monthVaccines.filter(v => completedIds.includes(v.id)).length}/{monthVaccines.length} Yapıldı
                    </span>
                  </div>

                  {/* Vaccines in this month */}
                  <div style={{ padding: '8px 16px' }}>
                    {monthVaccines.map((v, idx) => {
                      const isDone = completedIds.includes(v.id)
                      return (
                        <div
                          key={v.id}
                          onClick={() => toggleVaccine(v.id)}
                          className="pressable"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 0',
                            borderBottom: idx < monthVaccines.length - 1 ? '0.5px solid var(--border-light)' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              border: isDone ? 'none' : '1.5px solid var(--border-medium)',
                              background: isDone ? 'var(--sage-dark)' : 'transparent',
                              color: 'white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, transition: 'all 0.15s ease',
                            }}
                          >
                            {isDone && <Check size={15} strokeWidth={2.5} />}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '14px', fontWeight: 600,
                              textDecoration: isDone ? 'line-through' : 'none',
                              color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                            }}>
                              {v.nameTr || v.name}
                            </div>
                            {v.description && (
                              <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                                {v.description}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* TAB 3: SAĞLIK GÜNLÜĞÜ */}
        {activeTab === 'health' && (
          <div>
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--border-medium)',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌡️</div>
              <h3 style={{ marginBottom: '8px' }}>Sağlık Günlüğü</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                Ateş ölçümleri, ilaç takibi ve sağlık notları için hızlı kayıt butonunu kullanın.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                Alt çubukta + butonuna tıkla → Sağlık seç
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
