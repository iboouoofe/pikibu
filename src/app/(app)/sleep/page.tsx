'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, Sun, Play, Square, ChevronRight, BarChart2, Star, Music, Waves, CloudRain, Wind } from 'lucide-react'
import { saveSleepLog, getSleepLogs, deleteSleepLog, getBabyProfile } from './actions'
import { soundEngine } from '@/lib/soundEngine'

export default function SleepPage() {
  const [history, setHistory] = useState<any[]>([])
  const [baby, setBaby] = useState<any>(null)
  const [showChart, setShowChart] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isNight, setIsNight] = useState(false)
  const [activeNoise, setActiveNoise] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadData() {
      // 1. Instant offline-first load from localStorage
      try {
        const saved = localStorage.getItem('pikibu_sleep_logs')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHistory(parsed)
          }
        }
      } catch (e) {}

      // 2. Fetch server data with safe fallback
      try {
        const [logs, babyData] = await Promise.all([
          getSleepLogs(),
          getBabyProfile()
        ])
        if (Array.isArray(logs) && logs.length > 0) {
          setHistory(logs)
          try { localStorage.setItem('pikibu_sleep_logs', JSON.stringify(logs)) } catch {}
        }
        if (babyData) setBaby(babyData)
      } catch (err) {
        console.warn('loadData notice:', err)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const handleToggle = async () => {
    if (running) {
      const currentStart = startTime || new Date(Date.now() - Math.max(seconds, 1) * 1000)
      const endTime = new Date()

      const newLog = {
        id: `sleep-${Date.now()}`,
        startTime: currentStart.toISOString(),
        endTime: endTime.toISOString(),
        isNight: isNight
      }

      // Instant optimistic update
      setHistory(prev => {
        const next = [newLog, ...prev]
        try { localStorage.setItem('pikibu_sleep_logs', JSON.stringify(next)) } catch {}
        return next
      })

      setRunning(false)
      setSeconds(0)
      setStartTime(null)

      try {
        await saveSleepLog(currentStart.toISOString(), endTime.toISOString(), isNight)
      } catch (err) {
        console.warn('saveSleepLog sync notice:', err)
      }
    } else {
      setStartTime(new Date())
      setSeconds(0)
      setRunning(true)
    }
  }

  const handleDelete = async (id: string) => {
    setHistory(prev => {
      const next = prev.filter(l => l.id !== id)
      try { localStorage.setItem('pikibu_sleep_logs', JSON.stringify(next)) } catch {}
      return next
    })
    setSelectedLog(null)
    try {
      await deleteSleepLog(id)
    } catch (e) {
      console.warn('Delete sleep log notice:', e)
    }
  }

  const circumference = 2 * Math.PI * 54
  const maxSec = 90 * 60
  const progress = Math.min(seconds / maxSec, 1)

  const babyMonths = baby?.birthDate
    ? Math.floor((new Date().getTime() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 4
  const babyName = baby?.name || 'Bebeğiniz'

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <header style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 28px) 20px 8px', maxWidth: '520px', margin: '0 auto' }}>
        <span className="eyebrow">{babyName} · {babyMonths} aylık</span>
        <h1 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, marginTop: '4px' }}>
          Uyku Takibi
        </h1>
      </header>

      <div style={{ padding: '20px 16px 120px', maxWidth: '520px', margin: '0 auto' }}>

        {/* SweetSpot hint */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)', padding: '16px',
          border: '0.5px solid var(--border-light)', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,113,227,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Star size={16} color="var(--accent)" fill="var(--accent)" />
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            <strong style={{ color: 'var(--text-primary)' }}>İdeal Uyku Tahmini:</strong> Bir sonraki uyku vakti <strong style={{ color: 'var(--accent)' }}>14:35</strong> (yaklaşık 23 dk kaldı).
          </p>
        </div>

        {/* Timer Circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div className="timer-ring" style={{ position: 'relative', width: '160px', height: '160px' }}>
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="54" className="timer-ring-track" strokeWidth="8" fill="none" stroke="var(--border-light)" />
              <circle
                cx="80" cy="80" r="54"
                className="timer-ring-fill"
                strokeWidth="8"
                fill="none"
                stroke={running ? 'var(--accent)' : 'var(--border-light)'}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <Moon size={22} color={running ? 'var(--accent)' : 'var(--text-subtle)'} />
              <div style={{
                fontFamily: 'inherit', fontSize: '28px', fontWeight: 700,
                letterSpacing: '-0.04em', marginTop: '6px',
                color: running ? 'var(--text-primary)' : 'var(--text-muted)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatTime(seconds)}
              </div>
            </div>
          </div>

          {/* Night toggle */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginTop: '20px', cursor: 'pointer',
          }}>
            <div style={{
              width: '48px', height: '28px',
              background: isNight ? 'var(--ink)' : 'var(--border-medium)',
              borderRadius: '14px', position: 'relative', transition: 'background var(--transition-base)',
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%', background: 'var(--ink-contrast)',
                position: 'absolute', top: '3px', left: isNight ? '23px' : '3px',
                transition: 'left var(--transition-base)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isNight ? <Moon size={12} color="var(--ink)" /> : <Sun size={12} color="#FBBF24" />}
              </div>
              <input type="checkbox" style={{ display: 'none' }}
                checked={isNight} onChange={(e) => setIsNight(e.target.checked)} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {isNight ? 'Gece Uykusu' : 'Gündüz Uykusu'}
            </span>
          </label>
        </div>

        {/* Start/Stop Button — High Contrast & Tactile */}
        <button
          id="sleep-toggle-main-btn"
          onClick={handleToggle}
          className="pressable"
          style={{
            width: '100%', height: '60px', borderRadius: 'var(--radius-full)',
            border: 'none', cursor: 'pointer', fontSize: '17px', fontWeight: 700,
            fontFamily: 'inherit',
            background: running
              ? 'linear-gradient(135deg, #FF453A, #FF3B30)'
              : 'var(--ink)',
            color: running ? '#FFFFFF' : 'var(--ink-contrast)',
            boxShadow: running ? '0 8px 24px rgba(255,69,58,0.35)' : 'var(--shadow-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all var(--transition-fast)',
            marginBottom: '28px',
          }}
        >
          {running ? (
            <><Square size={20} fill="currentColor" stroke="currentColor" /> Uykuyu Bitir & Kaydet</>
          ) : (
            <><Play size={20} fill="currentColor" stroke="currentColor" /> Uyku Başladı</>
          )}
        </button>

        {/* White Noise Player */}
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
          border: '0.5px solid var(--border-light)', padding: '20px', marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Music size={18} color="var(--lavender-dark)" /> Beyaz Gürültü (Ninni)
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeNoise && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
              )}
              <a href="/sounds" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Tüm Sesler →
              </a>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { id: 'shush', name: 'Pış Pış', icon: Music },
              { id: 'womb', name: 'Anne Karnı', icon: Waves },
              { id: 'rain', name: 'Yağmur', icon: CloudRain },
              { id: 'dryer', name: 'Fön', icon: Wind },
            ].map(noise => (
              <button key={noise.id}
                onClick={() => {
                  if (activeNoise === noise.id) {
                    soundEngine.stop(noise.id)
                    setActiveNoise(null)
                  } else {
                    soundEngine.play(noise.id, true)
                    setActiveNoise(noise.id)
                  }
                }}
                className="pressable"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  padding: '14px 8px', borderRadius: '14px', cursor: 'pointer',
                  background: activeNoise === noise.id ? 'var(--accent-soft)' : 'var(--bg-raised)',
                  border: `1.5px solid ${activeNoise === noise.id ? 'var(--accent)' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: activeNoise === noise.id ? 'var(--accent)' : 'var(--bg-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <noise.icon size={20} color={activeNoise === noise.id ? 'white' : 'var(--text-muted)'} />
                </div>
                <span style={{ 
                  fontSize: '12px', fontWeight: activeNoise === noise.id ? 700 : 500, 
                  color: activeNoise === noise.id ? 'var(--accent)' : 'var(--text-secondary)' 
                }}>
                  {noise.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep History */}
        <div>
          <div className="section-header">
            <span className="section-title">Uyku Geçmişi</span>
            <button 
              onClick={() => setShowChart(!showChart)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '13px', fontWeight: 600 }}>
              <BarChart2 size={14} /> {showChart ? 'Liste' : 'Grafik'}
            </button>
          </div>

          {showChart ? (
            <div style={{ background: 'var(--bg-surface)', padding: '24px 16px', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border-light)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', marginBottom: '16px', textAlign: 'center' }}>Haftalık Uyku Özeti</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingBottom: '20px', borderBottom: '1px dashed var(--border-medium)' }}>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'].map((day, i) => (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: `${Math.max(20, (i + 1) * 14 + 20)}px`, 
                      background: i === 3 ? 'var(--accent)' : 'var(--bg-raised)', 
                      borderRadius: '6px' 
                    }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{day}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '16px' }}>
                Bu hafta ortalama uyku süresi: <strong>11 saat 20 dk</strong>
              </p>
            </div>
          ) : (
            <>
              {/* Today total */}
              <div style={{
                background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                padding: '16px 20px', marginBottom: '14px',
                border: '0.5px solid var(--border-light)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>Bugün toplam</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>2 kestirme + 1 gece uykusu</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                  9s 40d
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border-light)' }}>
                    Henüz kayıt yok. Uyku takibi için başlat butonuna dokunun.
                  </div>
                ) : history.map(log => {
                  const s = new Date(log.startTime)
                  const e = log.endTime ? new Date(log.endTime) : new Date()
                  const diffMin = Math.round((e.getTime() - s.getTime()) / 60000)
                  const durationStr = diffMin > 60 ? `${Math.floor(diffMin / 60)}s ${diffMin % 60}d` : `${diffMin}d`
                  
                  return (
                    <div key={log.id} 
                      onClick={() => setSelectedLog(log)}
                      className="pressable"
                      style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px', background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border-light)',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: log.isNight ? 'rgba(94,92,230,0.12)' : 'rgba(255,159,10,0.14)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {log.isNight ? <Moon size={18} color="var(--lavender-dark)" /> : <Sun size={18} color="var(--butter-dark)" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>{durationStr}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {s.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} · 
                          {s.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} – 
                          {log.endTime ? e.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'devam ediyor'}
                        </div>
                      </div>
                      <ChevronRight size={16} color="var(--text-subtle)" />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Log Detail / Delete Modal */}
      {selectedLog && (
        <div className="modal-overlay" style={{ justifyContent: 'center' }} onClick={() => setSelectedLog(null)} role="dialog" aria-modal="true">
          <div className="bottom-sheet" style={{ maxWidth: '520px', background: 'var(--bg-base)' }} onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {selectedLog.isNight ? '🌙' : '☀️'}
              </div>
              <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Kayıt Detayı</h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                {new Date(selectedLog.startTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} · 
                {new Date(selectedLog.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} – 
                {selectedLog.endTime ? new Date(selectedLog.endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'devam ediyor'}
              </div>
            </div>

            <button 
              className="btn btn-block pressable" 
              style={{ justifyContent: 'center', background: 'var(--danger)', color: '#FFFFFF', marginBottom: '12px', height: '52px', fontWeight: 600 }}
              onClick={() => handleDelete(selectedLog.id)}
            >
              Bu Kaydı Sil
            </button>
            <button 
              className="btn btn-secondary btn-block pressable" 
              style={{ justifyContent: 'center', height: '52px', fontWeight: 600 }}
              onClick={() => setSelectedLog(null)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
