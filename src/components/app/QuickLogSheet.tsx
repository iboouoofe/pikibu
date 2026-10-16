'use client'

import { useState, useEffect, useRef } from 'react'
import {
  X, Droplets, Moon, Thermometer, ChevronRight, ChevronLeft,
  Timer, Milk, Apple, Pill, Baby, Loader2, Check
} from 'lucide-react'
import { saveFeedingLog, saveDiaperLog, saveHealthLog } from '@/app/(app)/actions'
import { saveSleepLog } from '@/app/(app)/sleep/actions'

interface Props {
  onClose: () => void
}

type LogType = 'feeding' | 'sleep' | 'diaper' | 'health' | null

export default function QuickLogSheet({ onClose }: Props) {
  const [activeLog, setActiveLog] = useState<LogType>(null)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Sleep state
  const [sleepRunning, setSleepRunning] = useState(false)
  const [sleepSeconds, setSleepSeconds] = useState(0)
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null)
  const [isNightSleep, setIsNightSleep] = useState(false)
  const sleepIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Feeding state
  const [feedingSubtype, setFeedingSubtype] = useState<'breast' | 'bottle' | 'solid'>('breast')
  const [feedingSide, setFeedingSide] = useState<'left' | 'right'>('left')
  const [feedingSeconds, setFeedingSeconds] = useState(0)
  const [feedingRunning, setFeedingRunning] = useState(false)
  const [bottleAmount, setBottleAmount] = useState<number>(90)
  const [solidNote, setSolidNote] = useState<string>('')
  const feedingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Diaper state
  const [diaperNote, setDiaperNote] = useState('')

  // Health state
  const [tempValue, setTempValue] = useState('36.8')
  const [medName, setMedName] = useState('')
  const [medDose, setMedDose] = useState('1.5')

  // Sleep timer ticker
  useEffect(() => {
    if (sleepRunning) {
      sleepIntervalRef.current = setInterval(() => setSleepSeconds((s) => s + 1), 1000)
    } else {
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current)
    }
    return () => {
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current)
    }
  }, [sleepRunning])

  // Feeding timer ticker
  useEffect(() => {
    if (feedingRunning) {
      feedingIntervalRef.current = setInterval(() => setFeedingSeconds((s) => s + 1), 1000)
    } else {
      if (feedingIntervalRef.current) clearInterval(feedingIntervalRef.current)
    }
    return () => {
      if (feedingIntervalRef.current) clearInterval(feedingIntervalRef.current)
    }
  }, [feedingRunning])

  const finishAndClose = () => {
    setSavedSuccess(true)
    setTimeout(() => {
      onClose()
    }, 600)
  }

  // Handle Save Diaper
  const handleSelectDiaper = async (typeId: 'wet' | 'dirty' | 'both' | 'dry') => {
    setSaving(true)
    const dbType = typeId === 'wet' ? 'WET' : typeId === 'dirty' ? 'DIRTY' : typeId === 'both' ? 'BOTH' : 'DRY'
    try {
      await saveDiaperLog(dbType, diaperNote.trim() || null)
    } catch (e) {
      console.warn('Diaper save notice:', e)
    }
    finishAndClose()
  }

  // Handle Sleep Toggle
  const handleSleepToggle = async () => {
    if (!sleepRunning) {
      setSleepStartTime(new Date())
      setSleepSeconds(0)
      setSleepRunning(true)
    } else {
      setSaving(true)
      const start = sleepStartTime || new Date(Date.now() - Math.max(sleepSeconds, 1) * 1000)
      const end = new Date()

      // Save to localStorage so sleep page reflects it immediately
      try {
        const saved = localStorage.getItem('pikibu_sleep_logs')
        const logs = saved ? JSON.parse(saved) : []
        const newLog = {
          id: `sleep-${Date.now()}`,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          isNight: isNightSleep
        }
        localStorage.setItem('pikibu_sleep_logs', JSON.stringify([newLog, ...logs]))
      } catch (e) {}

      try {
        await saveSleepLog(start.toISOString(), end.toISOString(), isNightSleep)
      } catch (e) {
        console.warn('Sleep save notice:', e)
      }
      setSleepRunning(false)
      finishAndClose()
    }
  }

  // Handle Breastfeeding Toggle & Save
  const handleBreastfeedingToggle = async () => {
    if (!feedingRunning) {
      setFeedingRunning(true)
    } else {
      setSaving(true)
      const dbType = feedingSide === 'left' ? 'BREAST_LEFT' : 'BREAST_RIGHT'
      try {
        await saveFeedingLog(dbType, null, feedingSide.toUpperCase(), `${Math.round(feedingSeconds / 60)} dakika emzirme`)
      } catch (e) {
        console.warn('Feeding save notice:', e)
      }
      setFeedingRunning(false)
      finishAndClose()
    }
  }

  // Handle Bottle Save
  const handleSaveBottle = async () => {
    setSaving(true)
    try {
      await saveFeedingLog('BOTTLE_FORMULA', bottleAmount, null, `${bottleAmount} ml mama`)
    } catch (e) {
      console.warn('Bottle save notice:', e)
    }
    finishAndClose()
  }

  // Handle Solid Save
  const handleSaveSolid = async () => {
    setSaving(true)
    try {
      await saveFeedingLog('SOLID', null, null, solidNote || 'Ek gıda tadımı')
    } catch (e) {
      console.warn('Solid save notice:', e)
    }
    finishAndClose()
  }

  // Handle Health Temp Save
  const handleSaveTemp = async () => {
    setSaving(true)
    try {
      const t = parseFloat(tempValue)
      await saveHealthLog(isNaN(t) ? 36.8 : t, null, `Ateş ölçümü: ${t}°C`)
    } catch (e) {
      console.warn('Temp save notice:', e)
    }
    finishAndClose()
  }

  // Handle Health Med Save
  const handleSaveMed = async () => {
    if (!medName.trim()) return
    setSaving(true)
    try {
      await saveHealthLog(null, medName.trim(), `Doz: ${medDose} ml`)
    } catch (e) {
      console.warn('Med save notice:', e)
    }
    finishAndClose()
  }

  const quickActions = [
    { id: 'feeding', icon: Milk, label: 'Beslenme', sublabel: 'Emzirme · Biberon · Ek gıda', color: 'var(--butter)' },
    { id: 'sleep', icon: Moon, label: 'Uyku', sublabel: 'Tek dokunuşla sayaç', color: 'var(--lavender)' },
    { id: 'diaper', icon: Droplets, label: 'Bez değişimi', sublabel: 'Islak · Kirli · Karışık', color: 'var(--sky)' },
    { id: 'health', icon: Thermometer, label: 'Sağlık', sublabel: 'Ateş · İlaç · Not', color: 'var(--pink)' },
  ] as const

  const titles: Record<Exclude<LogType, null>, string> = {
    feeding: 'Beslenme', sleep: 'Uyku', diaper: 'Bez değişimi', health: 'Sağlık',
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const diaperTypes = [
    { id: 'wet', label: 'Islak', dot: 'var(--sky)' },
    { id: 'dirty', label: 'Kirli', dot: 'var(--butter)' },
    { id: 'both', label: 'Karışık', dot: 'var(--pink)' },
    { id: 'dry', label: 'Kuru', dot: 'var(--text-subtle)' },
  ] as const

  const panel: React.CSSProperties = {
    background: 'var(--bg-raised)', borderRadius: 'var(--radius-lg)', padding: '20px',
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Hızlı kayıt">
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', margin: '0 auto', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="sheet-handle" />

        {/* Header */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', minHeight: '36px' }}>
          {activeLog ? (
            <button
              id="quicklog-back"
              onClick={() => setActiveLog(null)}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '17px', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', marginLeft: '-6px' }}
            >
              <ChevronLeft size={22} /> Geri
            </button>
          ) : (
            <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em' }}>Hızlı Kayıt</h2>
          )}

          {activeLog && (
            <span style={{ fontSize: '17px', fontWeight: 600, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {titles[activeLog]}
            </span>
          )}

          <button
            id="quicklog-close"
            onClick={onClose}
            aria-label="Kapat"
            style={{ width: '32px', height: '32px', border: 'none', borderRadius: '50%', background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* Success toast overlay */}
        {savedSuccess && (
          <div style={{ padding: '16px', background: 'rgba(74,222,128,0.15)', borderRadius: '14px', border: '1px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--sage-dark)', fontWeight: 700, marginBottom: '16px' }}>
            <Check size={20} strokeWidth={3} /> Başarıyla kaydedildi!
          </div>
        )}

        {/* Main Action List */}
        {!activeLog && (
          <div className="list-group stagger" style={{ background: 'var(--bg-raised)', border: 'none' }}>
            {quickActions.map(({ id, icon: Icon, label, sublabel, color }) => (
              <button
                key={id}
                id={`quicklog-${id}`}
                onClick={() => setActiveLog(id as LogType)}
                className="list-row"
                style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', minHeight: '68px' }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#fff" strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '16px', color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>{label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '1px' }}>{sublabel}</div>
                </div>
                <ChevronRight size={17} color="var(--text-subtle)" />
              </button>
            ))}
          </div>
        )}

        {/* FEEDING LOG */}
        {activeLog === 'feeding' && (
          <div className="animate-rise">
            {/* Subtype tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { id: 'breast', label: 'Emzirme', icon: Milk },
                { id: 'bottle', label: 'Biberon', icon: Baby },
                { id: 'solid', label: 'Ek Gıda', icon: Apple },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setFeedingSubtype(id as any)}
                  style={{
                    padding: '10px 4px', borderRadius: '12px',
                    border: feedingSubtype === id ? '1.5px solid var(--accent)' : '1px solid var(--border-light)',
                    background: feedingSubtype === id ? 'var(--accent-soft)' : 'var(--bg-raised)',
                    color: feedingSubtype === id ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {feedingSubtype === 'breast' && (
              <div style={{ ...panel, marginBottom: '12px' }}>
                <div className="eyebrow" style={{ marginBottom: '14px' }}>Emzirme kronometresi</div>

                <div className="segmented" style={{ background: 'var(--bg-surface)', marginBottom: '24px' }}>
                  {(['left', 'right'] as const).map((side) => (
                    <button
                      key={side}
                      id={`feeding-side-${side}`}
                      data-active={feedingSide === side}
                      onClick={() => setFeedingSide(side)}
                    >
                      {side === 'left' ? 'Sol Göğüs' : 'Sağ Göğüs'}
                    </button>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div className="timer-display" style={{ fontSize: '42px', fontWeight: 800 }}>
                    {formatTime(feedingSeconds)}
                  </div>
                </div>

                <button
                  id="feeding-timer-toggle"
                  onClick={handleBreastfeedingToggle}
                  disabled={saving}
                  className={`btn btn-block ${feedingRunning ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ height: '52px', justifyContent: 'center' }}
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Timer size={18} />
                      {feedingRunning ? 'Durdur ve Kaydet' : 'Emzirmeyi Başlat'}
                    </>
                  )}
                </button>
              </div>
            )}

            {feedingSubtype === 'bottle' && (
              <div style={{ ...panel, marginBottom: '12px' }}>
                <div className="eyebrow" style={{ marginBottom: '12px' }}>Biberon Miktarı (ml)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  {[60, 90, 120, 150].map((ml) => (
                    <button
                      key={ml}
                      onClick={() => setBottleAmount(ml)}
                      style={{
                        padding: '12px 0', borderRadius: '10px',
                        border: bottleAmount === ml ? '1.5px solid var(--accent)' : '1px solid var(--border-light)',
                        background: bottleAmount === ml ? 'var(--accent-soft)' : 'var(--bg-surface)',
                        color: bottleAmount === ml ? 'var(--accent)' : 'var(--text-primary)',
                        fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      {ml} ml
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={bottleAmount}
                  onChange={(e) => setBottleAmount(Number(e.target.value))}
                  className="input"
                  placeholder="Miktar (ml)"
                  style={{ marginBottom: '16px' }}
                />
                <button
                  onClick={handleSaveBottle}
                  disabled={saving}
                  className="btn btn-primary btn-block"
                  style={{ height: '50px', justifyContent: 'center' }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Biberon Kaydet'}
                </button>
              </div>
            )}

            {feedingSubtype === 'solid' && (
              <div style={{ ...panel, marginBottom: '12px' }}>
                <div className="eyebrow" style={{ marginBottom: '12px' }}>Ek Gıda Tadımı</div>
                <input
                  type="text"
                  value={solidNote}
                  onChange={(e) => setSolidNote(e.target.value)}
                  className="input"
                  placeholder="Örn: Buharda Havuç Püresi (3 tatlı kaşığı)"
                  style={{ marginBottom: '16px' }}
                />
                <button
                  onClick={handleSaveSolid}
                  disabled={saving}
                  className="btn btn-primary btn-block"
                  style={{ height: '50px', justifyContent: 'center' }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Ek Gıda Kaydet'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* SLEEP LOG */}
        {activeLog === 'sleep' && (
          <div className="animate-rise" style={{ textAlign: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: '128px', height: '128px', margin: '0 auto 24px', borderRadius: '50%',
                background: sleepRunning ? 'radial-gradient(circle at 30% 30%, #2B2B33, #000)' : 'var(--bg-raised)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all var(--transition-slow)',
                boxShadow: sleepRunning ? '0 0 0 10px var(--accent-soft), 0 20px 50px rgba(94,92,230,0.35)' : 'none',
              }}
            >
              <Moon size={40} strokeWidth={1.5} color={sleepRunning ? '#fff' : 'var(--text-muted)'} className={sleepRunning ? 'animate-pulse-soft' : undefined} />
            </div>

            <div className="timer-display" style={{ marginBottom: '10px', fontSize: '42px', fontWeight: 800, color: sleepRunning ? 'var(--text-primary)' : 'var(--text-subtle)' }}>
              {formatTime(sleepSeconds)}
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '15px' }}>
              {sleepRunning ? 'Bebek uyuyor...' : 'Uyku sayacını başlatın'}
            </p>

            <button
              id="sleep-toggle"
              onClick={handleSleepToggle}
              disabled={saving}
              className={`btn btn-block ${sleepRunning ? 'btn-secondary' : 'btn-primary'}`}
              style={{ height: '54px', justifyContent: 'center' }}
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : sleepRunning ? (
                'Uyandı — Kaydet'
              ) : (
                'Uyku Başladı'
              )}
            </button>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={isNightSleep}
                onChange={(e) => setIsNightSleep(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
              />
              Gece uykusu
            </label>
          </div>
        )}

        {/* DIAPER LOG */}
        {activeLog === 'diaper' && (
          <div className="animate-rise">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {diaperTypes.map(({ id, label, dot }) => (
                <button
                  key={id}
                  id={`diaper-${id}`}
                  disabled={saving}
                  className="pressable"
                  style={{ ...panel, border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '22px', cursor: 'pointer', textAlign: 'left' }}
                  onClick={() => handleSelectDiaper(id)}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: dot }} />
                  <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>{label}</span>
                </button>
              ))}
            </div>

            <textarea
              id="diaper-note"
              className="input"
              value={diaperNote}
              onChange={(e) => setDiaperNote(e.target.value)}
              placeholder="Not (örneğin: pişik kremi sürüldü)"
              style={{ height: '88px', padding: '14px 18px', resize: 'none' }}
            />
          </div>
        )}

        {/* HEALTH LOG */}
        {activeLog === 'health' && (
          <div className="animate-rise" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={panel}>
              <div className="eyebrow" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Thermometer size={13} /> Ateş Ölçümü
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    id="health-temp"
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="input"
                    placeholder="36.8"
                    style={{ background: 'var(--bg-surface)', paddingRight: '44px' }}
                    step="0.1" min="34" max="42"
                  />
                  <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', fontSize: '15px' }}>°C</span>
                </div>
                <button
                  onClick={handleSaveTemp}
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ height: '54px', padding: '0 22px' }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : 'Kaydet'}
                </button>
              </div>
            </div>

            <div style={panel}>
              <div className="eyebrow" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Pill size={13} /> İlaç / Damla
              </div>
              <input
                id="health-med-name"
                type="text"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                className="input"
                placeholder="İlaç adı (ör. Calpol, D vitamini)"
                style={{ marginBottom: '10px', background: 'var(--bg-surface)' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  id="health-med-dose"
                  type="number"
                  value={medDose}
                  onChange={(e) => setMedDose(e.target.value)}
                  className="input"
                  placeholder="Doz (ml)"
                  step="0.25"
                  style={{ background: 'var(--bg-surface)' }}
                />
                <button
                  onClick={handleSaveMed}
                  disabled={saving || !medName.trim()}
                  className="btn btn-primary"
                  style={{ height: '54px', padding: '0 22px', whiteSpace: 'nowrap' }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
