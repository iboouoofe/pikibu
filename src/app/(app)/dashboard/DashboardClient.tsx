'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Moon, Milk, Droplets, ChevronRight, Bell, Sun, Sunrise, Sunset,
  CloudRain, Shield, Brain, Soup, FlaskConical, X, Check, Loader2, Plus, Clock
} from 'lucide-react'
import { saveFeedingLog, saveDiaperLog } from '../actions'

export default function DashboardClient({ baby }: { baby: any }) {
  const ageDays = baby?.birthDate 
    ? Math.max(0, Math.floor((new Date().getTime() - new Date(baby.birthDate).getTime()) / (1000 * 60 * 60 * 24))) 
    : 120

  const babyMonths = Math.floor(ageDays / 30.4375)
  const babyWeeks = Math.max(1, Math.floor(ageDays / 7))

  // Calculate current leap accurately
  const LEAP_SCHEDULE = [
    { number: 1, startWeek: 4, endWeek: 5, title: 'Değişen Duyular' },
    { number: 2, startWeek: 7, endWeek: 9, title: 'Oluşumlar & Desenler' },
    { number: 3, startWeek: 11, endWeek: 12, title: 'Yumuşak Geçişler' },
    { number: 4, startWeek: 14, endWeek: 19, title: 'Olaylar Dünyası' },
    { number: 5, startWeek: 22, endWeek: 26, title: 'İlişkiler Dünyası' },
    { number: 6, startWeek: 33, endWeek: 37, title: 'Kategoriler Dünyası' },
    { number: 7, startWeek: 41, endWeek: 46, title: 'Zincirleme Olaylar' },
    { number: 8, startWeek: 51, endWeek: 54, title: 'Programlar Dünyası' },
    { number: 9, startWeek: 59, endWeek: 64, title: 'İlkeler Dünyası' },
    { number: 10, startWeek: 70, endWeek: 75, title: 'Sistemler Dünyası' },
  ]

  let currentLeapInfo = LEAP_SCHEDULE.find(l => babyWeeks >= l.startWeek && babyWeeks <= l.endWeek)
  let isStormy = true
  let leapDaysLeft = 5

  if (currentLeapInfo) {
    isStormy = true
    leapDaysLeft = Math.max(1, (currentLeapInfo.endWeek - babyWeeks) * 7 + 3)
  } else {
    // Find next upcoming leap
    const nextLeap = LEAP_SCHEDULE.find(l => l.startWeek > babyWeeks) || LEAP_SCHEDULE[LEAP_SCHEDULE.length - 1]
    currentLeapInfo = nextLeap
    isStormy = false
    leapDaysLeft = Math.max(1, (nextLeap.startWeek - babyWeeks) * 7)
  }

  const babyData = {
    name: baby?.name || 'Bebeğiniz',
    ageMonths: babyMonths,
    ageWeeks: babyWeeks,
    currentLeap: {
      number: currentLeapInfo.number,
      title: currentLeapInfo.title,
      phase: (isStormy ? 'stormy' : 'sunny') as 'stormy' | 'sunny',
      daysLeft: leapDaysLeft,
    },
  }

  // Initial values from baby logs
  const latestPumping = baby?.feedingLogs?.find((l: any) => l.type === 'BOTTLE_MILK')
  const latestDiaper = baby?.diaperLogs?.[0]
  const latestSleep = baby?.sleepLogs?.[0]
  const latestFeeding = baby?.feedingLogs?.[0]

  const [pumpingValue, setPumpingValue] = useState(latestPumping?.amountMl ? `${latestPumping.amountMl} ml` : '120 ml')
  const [pumpingMeta, setPumpingMeta] = useState(latestPumping ? 'Kaydedildi' : 'Kayıt ekle')
  const [diaperValue, setDiaperValue] = useState(
    latestDiaper ? (latestDiaper.type === 'WET' ? 'Islak' : latestDiaper.type === 'DIRTY' ? 'Kirli' : latestDiaper.type === 'BOTH' ? 'Karışık' : 'Kuru') : 'Kayıt ekle'
  )
  const [diaperMeta, setDiaperMeta] = useState(latestDiaper ? 'Kaydedildi' : 'Dokun')

  // Modals state
  const [showPumpingModal, setShowPumpingModal] = useState(false)
  const [showDiaperModal, setShowDiaperModal] = useState(false)
  const [saving, setSaving] = useState(false)

  // Pumping form state
  const [pumpingAmount, setPumpingAmount] = useState<number>(120)
  const [pumpingSide, setPumpingSide] = useState<'BOTH' | 'LEFT' | 'RIGHT'>('BOTH')
  const [pumpingStorage, setPumpingStorage] = useState<'FRIDGE' | 'FREEZER' | 'FRESH'>('FRIDGE')
  const [pumpingNotes, setPumpingNotes] = useState('')

  // Diaper form state
  const [diaperType, setDiaperType] = useState<'WET' | 'DIRTY' | 'BOTH' | 'DRY'>('WET')
  const [diaperNotes, setDiaperNotes] = useState('')

  // Dynamic SweetSpot calculation
  const wakeWindowsByMonths: Record<number, number> = {
    0: 50, 1: 65, 2: 80, 3: 95, 4: 110, 5: 125, 6: 140, 7: 155, 8: 170, 9: 185, 10: 200, 11: 215, 12: 240,
  }
  const maxAwakeMins = wakeWindowsByMonths[Math.min(babyMonths, 12)] || 110

  const lastWakeTime = latestSleep?.endTime
    ? new Date(latestSleep.endTime)
    : new Date(Date.now() - Math.min(maxAwakeMins * 0.75, 75) * 60000)

  const diffMs = Math.max(0, Date.now() - lastWakeTime.getTime())
  const awakeMinsCalculated = Math.floor(diffMs / 60000)
  const nextSleepTarget = new Date(lastWakeTime.getTime() + maxAwakeMins * 60000)
  const nextSleepFormatted = nextSleepTarget.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

  const sweetspot = {
    nextSleepTime: nextSleepFormatted,
    windowMins: 15,
    awakeMinutes: awakeMinsCalculated,
    maxAwakeMinutes: maxAwakeMins,
  }

  const [greeting] = useState(() => {
    const h = new Date().getHours()
    if (h < 6) return { text: 'İyi geceler', Icon: Moon }
    if (h < 12) return { text: 'Günaydın', Icon: Sunrise }
    if (h < 18) return { text: 'İyi günler', Icon: Sun }
    return { text: 'İyi akşamlar', Icon: Sunset }
  })

  const [today] = useState(() =>
    new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })
  )

  const awakePercent = Math.min((sweetspot.awakeMinutes / sweetspot.maxAwakeMinutes) * 100, 100)
  const GreetingIcon = greeting.Icon
  const initial = babyData.name.charAt(0).toLocaleUpperCase('tr-TR')

  // Ring geometry
  const R = 44
  const C = 2 * Math.PI * R
  const dash = C - (awakePercent / 100) * C

  const stormy = babyData.currentLeap.phase === 'stormy'

  // Handle Pumping Save
  const handleSavePumping = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const notes = `Saklama: ${pumpingStorage === 'FRIDGE' ? 'Buzdolabı' : pumpingStorage === 'FREEZER' ? 'Dondurucu' : 'Taze'}${pumpingNotes ? ` - ${pumpingNotes}` : ''}`
      await saveFeedingLog('BOTTLE_MILK', pumpingAmount, pumpingSide, notes)
      setPumpingValue(`${pumpingAmount} ml`)
      setPumpingMeta('Az önce')
      setShowPumpingModal(false)
    } catch (err) {
      console.error('Error saving pumping log:', err)
    } finally {
      setSaving(false)
    }
  }

  // Handle Diaper Save
  const handleSaveDiaper = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveDiaperLog(diaperType, diaperNotes || null)
      const label = diaperType === 'WET' ? 'Islak' : diaperType === 'DIRTY' ? 'Kirli' : diaperType === 'BOTH' ? 'Karışık' : 'Kuru'
      setDiaperValue(label)
      setDiaperMeta('Az önce')
      setShowDiaperModal(false)
    } catch (err) {
      console.error('Error saving diaper log:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* ─── LARGE TITLE HEADER ───────────────────────── */}
      <header style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 28px) 20px 8px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GreetingIcon size={13} strokeWidth={2} /> {greeting.text} · {today}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button id="notifications-btn" className="btn-icon pressable" aria-label="Bildirimler" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', border: '0.5px solid var(--border-light)' }}>
              <Bell size={17} strokeWidth={1.8} />
            </button>
            <Link href="/settings" id="profile-btn" aria-label="Ayarlar" className="pressable" style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'var(--ink)', color: 'var(--ink-contrast)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 600, textDecoration: 'none',
            }}>
              {initial}
            </Link>
          </div>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
          {babyData.name}
        </h1>
        <p style={{ marginTop: '6px', fontSize: '17px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.015em' }}>
          {babyData.ageMonths} aylık · {babyData.ageWeeks}. hafta
        </p>
      </header>

      <div style={{ padding: '20px 16px 120px', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ─── HERO: SWEETSPOT ─────────────────────────── */}
        <Link href="/sleep" className="sweetspot-banner pressable" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>Sonraki uyku</span>
              <div className="display-num" style={{ fontSize: '64px', fontWeight: 300, color: '#fff', marginTop: '10px' }}>
                {sweetspot.nextSleepTime}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '10px' }}>
                ±{sweetspot.windowMins} dk ideal pencere
              </p>
            </div>
            <div style={{ position: 'relative', width: '104px', height: '104px', flexShrink: 0 }}>
              <svg width="104" height="104" viewBox="0 0 104 104" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="52" cy="52" r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="6" />
                <circle
                  cx="52" cy="52" r={R} fill="none"
                  stroke="url(#ringGrad)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={dash}
                  style={{ transition: 'stroke-dashoffset 1.2s var(--ease-out)' }}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8E8CF0" />
                    <stop offset="100%" stopColor="#2997FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="display-num" style={{ fontSize: '22px', color: '#fff' }}>{sweetspot.awakeMinutes}</span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '3px', fontWeight: 500 }}>/ {sweetspot.maxAwakeMinutes} dk</span>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1, marginTop: '20px', paddingTop: '16px', borderTop: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Uyanıklık süresi</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '2px' }}>
              Uyku takibi <ChevronRight size={15} />
            </span>
          </div>
        </Link>

        {/* ─── TODAY GRID (UYKU, BESLENME, BEZ, SAĞIM) ─────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          
          {/* UYKU */}
          <Link href="/sleep" className="card pressable" style={{ textDecoration: 'none', padding: '18px', display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '132px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={17} color="#fff" strokeWidth={2} />
              </div>
              <ChevronRight size={16} color="var(--text-subtle)" />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Uyku</div>
              <div style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '2px' }}>
                {latestSleep ? 'Takipte' : '—'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                {latestSleep ? 'Son uyku kayıtlı' : 'Kayıt ekle'}
              </div>
            </div>
          </Link>

          {/* BESLENME */}
          <Link href="/feeding" className="card pressable" style={{ textDecoration: 'none', padding: '18px', display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '132px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--butter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Milk size={17} color="#fff" strokeWidth={2} />
              </div>
              <ChevronRight size={16} color="var(--text-subtle)" />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Beslenme</div>
              <div style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '2px' }}>
                {latestFeeding ? (latestFeeding.type === 'BOTTLE_MILK' ? 'Sağım Sütü' : latestFeeding.type === 'SOLID' ? 'Ek Gıda' : 'Emzirme') : 'Ek Gıda & Süt'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>Rehberi aç</div>
            </div>
          </Link>

          {/* BEZ DEĞİŞİMİ (Interactive Modal Trigger) */}
          <button
            type="button"
            onClick={() => setShowDiaperModal(true)}
            className="card pressable"
            style={{ border: 'none', background: 'var(--bg-surface)', textAlign: 'left', padding: '18px', display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '132px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={17} color="#fff" strokeWidth={2} />
              </div>
              <Plus size={16} color="var(--text-subtle)" />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Bez Değişimi</div>
              <div style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '2px' }}>{diaperValue}</div>
              <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500, marginTop: '2px' }}>{diaperMeta}</div>
            </div>
          </button>

          {/* SAĞIM (Interactive Modal Trigger) */}
          <button
            type="button"
            onClick={() => setShowPumpingModal(true)}
            className="card pressable"
            style={{ border: 'none', background: 'var(--bg-surface)', textAlign: 'left', padding: '18px', display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '132px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FlaskConical size={17} color="#fff" strokeWidth={2} />
              </div>
              <Plus size={16} color="var(--text-subtle)" />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Sağım</div>
              <div style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '2px' }}>{pumpingValue}</div>
              <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500, marginTop: '2px' }}>{pumpingMeta}</div>
            </div>
          </button>

        </div>

        {/* ─── LEAP CARD ──────────────────────────────── */}
        <Link href="/leaps" className="card pressable" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '18px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
            background: 'var(--bg-raised)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {stormy ? <CloudRain size={20} strokeWidth={1.8} color="var(--text-primary)" /> : <Sun size={20} strokeWidth={1.8} color="var(--text-primary)" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ marginBottom: '4px' }}>{babyData.currentLeap.number}. Atak</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
              {babyData.currentLeap.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {stormy ? `Fırtınalı dönem · ${babyData.currentLeap.daysLeft} gün kaldı` : 'Güneşli dönem · gelişim zamanı'}
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-subtle)" />
        </Link>

        {/* ─── LIST GROUP ─────────────────────────────── */}
        <div className="list-group">
          <Link href="/health" className="list-row">
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Aşı Takvimi</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{babyData.ageMonths}. Ay ve sıradaki aşılar</div>
            </div>
            <ChevronRight size={16} color="var(--text-subtle)" />
          </Link>
          <Link href="/feeding" className="list-row">
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--butter)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Soup size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 500 }}>Ek gıda & BLW rehberi</div>
            <ChevronRight size={16} color="var(--text-subtle)" />
          </Link>
          <Link href="/leaps" className="list-row">
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Brain size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 500 }}>Büyüme atakları & sıçramalar</div>
            <ChevronRight size={16} color="var(--text-subtle)" />
          </Link>
        </div>

      </div>

      {/* ─── SAĞIM (PUMPING) MODAL BOTTOM SHEET ────────────────────────── */}
      {showPumpingModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPumpingModal(false)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 100 }}
        >
          <div
            className="bottom-sheet animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', margin: '0 auto', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div className="sheet-handle" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,55,95,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlaskConical size={20} color="var(--pink)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Anne Sütü Sağımı</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Sağılan süt miktarını kaydet</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPumpingModal(false)}
                className="btn-icon pressable"
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-raised)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePumping}>
              {/* Presets */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Miktar (ml)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '14px' }}>
                {[60, 90, 120, 150, 180].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPumpingAmount(preset)}
                    className="pressable"
                    style={{
                      padding: '10px 0', borderRadius: '10px',
                      border: pumpingAmount === preset ? '1.5px solid var(--pink)' : '1px solid var(--border-light)',
                      background: pumpingAmount === preset ? 'rgba(255,55,95,0.12)' : 'var(--bg-surface)',
                      color: pumpingAmount === preset ? 'var(--pink)' : 'var(--text-primary)',
                      fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Custom ml input */}
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input
                  type="number"
                  min="5"
                  max="500"
                  required
                  value={pumpingAmount || ''}
                  onChange={(e) => setPumpingAmount(Number(e.target.value))}
                  placeholder="Örn. 120"
                  className="input"
                  style={{ fontSize: '18px', fontWeight: 700, paddingRight: '48px', textAlign: 'center' }}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '14px' }}>
                  ml
                </span>
              </div>

              {/* Side selector */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Göğüs
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {[
                  { id: 'BOTH', label: 'Çift Göğüs' },
                  { id: 'LEFT', label: 'Sol' },
                  { id: 'RIGHT', label: 'Sağ' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPumpingSide(s.id as any)}
                    className="pressable"
                    style={{
                      padding: '12px 0', borderRadius: '12px',
                      border: pumpingSide === s.id ? '1.5px solid var(--accent)' : '1px solid var(--border-light)',
                      background: pumpingSide === s.id ? 'var(--accent-soft)' : 'var(--bg-raised)',
                      color: pumpingSide === s.id ? 'var(--accent)' : 'var(--text-primary)',
                      fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Storage location */}
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Saklama Yeri
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {[
                  { id: 'FRIDGE', label: 'Buzdolabı ❄️', desc: '3 Gün' },
                  { id: 'FREEZER', label: 'Dondurucu 🧊', desc: '3 Ay' },
                  { id: 'FRESH', label: 'Taze / Oda 🍼', desc: '3 Saat' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPumpingStorage(st.id as any)}
                    className="pressable"
                    style={{
                      padding: '10px 4px', borderRadius: '12px', textAlign: 'center',
                      border: pumpingStorage === st.id ? '1.5px solid var(--sage)' : '1px solid var(--border-light)',
                      background: pumpingStorage === st.id ? 'rgba(76,208,122,0.12)' : 'var(--bg-raised)',
                      color: pumpingStorage === st.id ? 'var(--sage-dark)' : 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{st.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{st.desc}</div>
                  </button>
                ))}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-block pressable"
                style={{ height: '52px', fontSize: '16px', fontWeight: 700 }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : 'Sağımı Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── BEZ (DIAPER) MODAL BOTTOM SHEET ────────────────────────── */}
      {showDiaperModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDiaperModal(false)}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 100 }}
        >
          <div
            className="bottom-sheet animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', margin: '0 auto', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div className="sheet-handle" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(50,173,230,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={20} color="var(--sky)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Bez Değişimi</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Bez durumunu seçin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDiaperModal(false)}
                className="btn-icon pressable"
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-raised)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDiaper}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { id: 'WET', label: 'Islak (Çiş)', emoji: '💧', color: 'var(--sky)' },
                  { id: 'DIRTY', label: 'Kirli (Kaka)', emoji: '💩', color: 'var(--butter)' },
                  { id: 'BOTH', label: 'Karışık (İkisi)', emoji: '🧻', color: 'var(--pink)' },
                  { id: 'DRY', label: 'Kuru', emoji: '☁️', color: 'var(--text-muted)' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDiaperType(d.id as any)}
                    className="pressable"
                    style={{
                      padding: '18px 14px', borderRadius: '14px', textAlign: 'left',
                      border: diaperType === d.id ? `2px solid ${d.color}` : '1px solid var(--border-light)',
                      background: diaperType === d.id ? 'var(--bg-surface)' : 'var(--bg-raised)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{d.emoji}</span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {diaperType === d.id ? 'Seçildi' : 'Seç'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Not ekle (isteğe bağlı)..."
                value={diaperNotes}
                onChange={(e) => setDiaperNotes(e.target.value)}
                className="input"
                style={{ height: '72px', padding: '12px 14px', resize: 'none', marginBottom: '20px', fontSize: '14px' }}
              />

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-block pressable"
                style={{ height: '52px', fontSize: '16px', fontWeight: 700 }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : 'Bezi Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
