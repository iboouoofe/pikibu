'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Square, Volume2, Timer, Wifi, Layers, Check, Sliders, Moon } from 'lucide-react'
import { soundEngine, SOUND_PRESETS, SoundPreset } from '@/lib/soundEngine'

type CategoryFilter = 'all' | 'womb' | 'nature' | 'home' | 'lullaby'

const categories: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'Tümü', icon: '✨' },
  { id: 'womb', label: 'Anne Karnı & Nabız', icon: '🫶' },
  { id: 'nature', label: 'Doğa & Yağmur', icon: '🌧️' },
  { id: 'home', label: 'Ev & Beyaz Gürültü', icon: '💨' },
  { id: 'lullaby', label: 'Ninniler', icon: '🎵' },
]

export default function SoundsPage() {
  const [playingIds, setPlayingIds] = useState<string[]>([])
  const [volume, setVolume] = useState<number>(70)
  const [timerMin, setTimerMin] = useState<number>(30)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [isMixerMode, setIsMixerMode] = useState<boolean>(false)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Subscribe to sound engine state
  useEffect(() => {
    const unsubscribe = soundEngine.subscribe(() => {
      setPlayingIds(soundEngine.getPlayingSounds())
      setVolume(soundEngine.getVolume())
    })
    setPlayingIds(soundEngine.getPlayingSounds())
    setVolume(soundEngine.getVolume())
    return () => unsubscribe()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (playingIds.length > 0 && remaining !== null) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r === null || r <= 1) {
            soundEngine.stopAll()
            return null
          }
          return r - 1
        })
      }, 1000)
    } else if (playingIds.length === 0) {
      setRemaining(null)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playingIds.length, remaining])

  const handleToggleSound = (sound: SoundPreset) => {
    if (soundEngine.isPlaying(sound.id)) {
      soundEngine.stop(sound.id)
    } else {
      if (!isMixerMode) {
        soundEngine.play(sound.id, true) // Stop other sounds
      } else {
        soundEngine.play(sound.id, false) // Layer with existing sounds
      }
      if (remaining === null && timerMin > 0) {
        setRemaining(timerMin * 60)
      }
    }
  }

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    soundEngine.setVolume(newVol)
  }

  const handleTimerSelect = (mins: number) => {
    setTimerMin(mins)
    if (mins === 0) {
      setRemaining(null)
    } else if (playingIds.length > 0) {
      setRemaining(mins * 60)
    }
  }

  const formatRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const filteredSounds = SOUND_PRESETS.filter((s) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'womb') return s.category === 'womb'
    if (activeCategory === 'nature') return s.category === 'nature'
    if (activeCategory === 'home') return s.category === 'home' || s.category === 'noise'
    if (activeCategory === 'lullaby') return s.category === 'lullaby'
    return true
  })

  const primaryPlayingSound = SOUND_PRESETS.find((s) => s.id === playingIds[0])

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: '110px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-surface)', padding: '52px 20px 20px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
              Beyaz Gürültü & Ninni 🎵
            </h1>
            <button
              onClick={() => setIsMixerMode(!isMixerMode)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '20px',
                border: `1.5px solid ${isMixerMode ? 'var(--accent)' : 'var(--border-light)'}`,
                background: isMixerMode ? 'var(--accent-soft)' : 'var(--bg-raised)',
                color: isMixerMode ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Layers size={14} /> {isMixerMode ? 'Mikser Açık' : 'Mikser'}
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            {isMixerMode
              ? 'Çoklu ses modu: Birden fazla sesi aynı anda birleştirerek çalın'
              : 'Bebeğinizi rahatlatacak ve derin uykuya geçirecek sesler'}
          </p>
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: '520px', margin: '0 auto' }}>

        {/* Currently playing banner */}
        {playingIds.length > 0 && primaryPlayingSound && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(165,166,246,0.18), rgba(0,113,227,0.12))',
              borderRadius: 'var(--radius-xl)', padding: '20px', marginBottom: '20px',
              border: '1px solid rgba(165,166,246,0.3)',
              boxShadow: '0 8px 30px rgba(0,113,227,0.08)',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {playingIds.length > 1 ? `${playingIds.length} Ses Birlikte Çalıyor` : 'Şu An Çalıyor'}
                </span>
              </div>
              <button
                onClick={() => soundEngine.stopAll()}
                style={{
                  background: 'rgba(239,68,68,0.12)', border: 'none', borderRadius: '8px',
                  padding: '4px 10px', color: '#EF4444', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <Square size={12} fill="#EF4444" /> Durdur
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '18px',
                background: primaryPlayingSound.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', flexShrink: 0,
              }}>
                {primaryPlayingSound.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {playingIds.map(id => SOUND_PRESETS.find(s => s.id === id)?.name).join(' + ')}
                </div>
                <div className="wave-bars" style={{ marginTop: '6px' }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>

              {remaining !== null && (
                <div style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Timer size={12} />
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>Kalan</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '17px', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {formatRemaining(remaining)}
                  </div>
                </div>
              )}
            </div>

            {/* Volume control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <Volume2 size={18} color="var(--text-muted)" />
              <input
                type="range" min={0} max={100} value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--coral)', height: '5px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', width: '36px', textAlign: 'right' }}>
                {volume}%
              </span>
            </div>
          </div>
        )}

        {/* Timer selector */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '10px' }}>
            KAPANMA ZAMANLAYICISI
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { m: 15, label: '15 dk' },
              { m: 30, label: '30 dk' },
              { m: 45, label: '45 dk' },
              { m: 60, label: '60 dk' },
              { m: 0, label: 'Sürekli ∞' },
            ].map(({ m, label }) => (
              <button
                key={m}
                onClick={() => handleTimerSelect(m)}
                style={{
                  padding: '8px 14px', borderRadius: '12px',
                  border: timerMin === m ? '1.5px solid var(--coral)' : '1px solid var(--border-light)',
                  background: timerMin === m ? 'rgba(0,113,227,0.1)' : 'var(--bg-surface)',
                  color: timerMin === m ? 'var(--coral)' : 'var(--text-secondary)',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '20px',
                border: activeCategory === c.id ? 'none' : '1px solid var(--border-light)',
                background: activeCategory === c.id ? 'var(--ink)' : 'var(--bg-surface)',
                color: activeCategory === c.id ? 'var(--ink-contrast)' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Sound cards list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredSounds.map((sound) => {
            const isPlaying = playingIds.includes(sound.id)
            return (
              <div
                key={sound.id}
                id={`sound-card-${sound.id}`}
                onClick={() => handleToggleSound(sound)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: isPlaying ? `2px solid ${sound.color}` : '1px solid var(--border-light)',
                  boxShadow: isPlaying ? `0 4px 20px ${sound.color}25` : 'var(--shadow-sm)',
                  cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '16px',
                    background: sound.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                  }}
                >
                  {sound.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                      {sound.name}
                    </span>
                    {isPlaying && (
                      <span id={`badge-playing-${sound.id}`} style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: `${sound.color}20`, color: sound.color }}>
                        ÇALIYOR
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                    {sound.description}
                  </div>
                </div>

                <button
                  id={`sound-play-btn-${sound.id}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleSound(sound)
                  }}
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: isPlaying ? 'rgba(239,68,68,0.12)' : sound.bg,
                    border: `2px solid ${isPlaying ? '#EF4444' : sound.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                  }}
                  aria-label={isPlaying ? 'Durdur' : 'Çal'}
                >
                  {isPlaying ? (
                    <Square size={16} color="#EF4444" fill="#EF4444" />
                  ) : (
                    <Play size={16} color={sound.color} fill={sound.color} style={{ marginLeft: '2px' }} />
                  )}
                </button>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
