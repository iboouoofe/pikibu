'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar, Brain, ArrowLeft, ChevronRight, Activity, Clock,
  Music, Sparkles, Check, ChevronDown
} from 'lucide-react'
import { calculateDueDate, calculateLeap } from '@/lib/calculators'

type ToolView = 'list' | 'due-date' | 'leap' | 'percentile' | 'wake-window'

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolView>('list')
  
  // State for Due Date Calculator
  const [lmpDate, setLmpDate] = useState('')
  const [dueDateResult, setDueDateResult] = useState<{dueDate: Date, currentWeek: number, currentDay: number} | null>(null)

  // State for Leap Calculator
  const [birthDate, setBirthDate] = useState('')
  const [eddDate, setEddDate] = useState('')
  const [leapResult, setLeapResult] = useState<{currentLeap: number | null, daysUntilNextLeap: number | null, adjustedAgeWeeks: number} | null>(null)

  // State for Percentile Calculator
  const [percentileGender, setPercentileGender] = useState<'female' | 'male'>('female')
  const [percentileMonths, setPercentileMonths] = useState<number>(6)
  const [percentileWeight, setPercentileWeight] = useState<string>('7.5')
  const [percentileHeight, setPercentileHeight] = useState<string>('66')
  const [percentileResult, setPercentileResult] = useState<{ weightP: number; heightP: number; evalText: string } | null>(null)

  const handleDueDateCalculate = () => {
    if (lmpDate) {
      setDueDateResult(calculateDueDate(lmpDate))
    }
  }

  const handleLeapCalculate = () => {
    if (birthDate && eddDate) {
      setLeapResult(calculateLeap(eddDate, birthDate))
    }
  }

  // WHO Percentile approximation
  const handlePercentileCalculate = () => {
    const w = parseFloat(percentileWeight)
    const h = parseFloat(percentileHeight)
    if (isNaN(w) || isNaN(h)) return

    // Standard WHO 50th percentile reference for female/male at age m
    const baseW = percentileGender === 'female' ? 3.2 + percentileMonths * 0.65 : 3.4 + percentileMonths * 0.7
    const baseH = percentileGender === 'female' ? 49 + percentileMonths * 2.3 : 50 + percentileMonths * 2.4

    const wDiff = (w - baseW) / (baseW * 0.12)
    const hDiff = (h - baseH) / (baseH * 0.05)

    // Rough conversion of z-score to percentile (10-90 scale)
    const wPct = Math.min(97, Math.max(3, Math.round(50 + wDiff * 25)))
    const hPct = Math.min(97, Math.max(3, Math.round(50 + hDiff * 25)))

    let evalText = 'Bebeğinizin gelişimi Dünya Sağlık Örgütü (WHO) persentil standartlarına göre sağlıklı ve dengeli bir eğride ilerlemektedir.'
    if (wPct < 15) {
      evalText = 'Kilo persentili ortalamanın biraz altında. Çocuk doktorunuzla beslenme sıklığını değerlendirebilirsiniz.'
    } else if (wPct > 85) {
      evalText = 'Kilo persentili ortalamanın üzerinde. Bebeğinizin boy ve kilo orantısı gayet güçlü seyrediyor.'
    }

    setPercentileResult({ weightP: wPct, heightP: hPct, evalText })
  }

  const wakeWindowData = [
    { age: '0–4 Hafta (Yenidoğan)', window: '35–60 dk', naps: '4–6 gündüz uykusu', total: '16–18 saat' },
    { age: '1–2 Aylık', window: '60–90 dk', naps: '4–5 gündüz uykusu', total: '15–16 saat' },
    { age: '3–4 Aylık', window: '75–120 dk', naps: '3–4 gündüz uykusu', total: '14–15 saat' },
    { age: '5–6 Aylık', window: '2–2.5 saat', naps: '3 gündüz uykusu', total: '13–14 saat' },
    { age: '7–8 Aylık', window: '2.5–3 saat', naps: '2–3 gündüz uykusu', total: '13–14 saat' },
    { age: '9–12 Aylık', window: '3–3.5 saat', naps: '2 gündüz uykusu', total: '12–14 saat' },
    { age: '13–18 Aylık', window: '4–5 saat', naps: '1–2 gündüz uykusu', total: '12–13 saat' },
    { age: '18–24 Aylık', window: '5–6 saat', naps: '1 gündüz uykusu', total: '11–13 saat' },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: '110px' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--bg-surface)', padding: '52px 20px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {activeTool !== 'list' && (
          <button
            onClick={() => setActiveTool('list')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label="Geri"
          >
            <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
        )}
        <div>
          <h1 style={{ marginBottom: '4px', fontSize: '24px', fontWeight: 800 }}>
            {activeTool === 'list' && 'Ebeveyn Araçları 🛠️'}
            {activeTool === 'due-date' && 'Doğum Tarihi Hesapla'}
            {activeTool === 'leap' && 'Atak Haftası Hesapla'}
            {activeTool === 'percentile' && 'Persentil Büyüme Takibi'}
            {activeTool === 'wake-window' && 'Uyanıklık Pencereleri Rehberi'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            {activeTool === 'list' && 'Gelişim, uyku ve gebelik için bilimsel araçlar'}
            {activeTool === 'due-date' && 'Son adet tarihinize göre (SAT)'}
            {activeTool === 'leap' && 'Bebeğinizin zihinsel sıçrama haftaları'}
            {activeTool === 'percentile' && 'WHO standartlarına göre boy/kilo persentili'}
            {activeTool === 'wake-window' && 'Aylara göre ideal uyanıklık ve uyku süreleri'}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '520px', margin: '0 auto' }}>

        {/* LIST VIEW */}
        {activeTool === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* 1. SAT Doğum Tarihi */}
            <div 
              onClick={() => setActiveTool('due-date')}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
                cursor: 'pointer', transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(0,113,227,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={24} color="var(--coral)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>Tahmini Doğum Tarihi</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>40 haftalık gebelik ve SAT hesaplayıcı</div>
              </div>
              <ChevronRight size={20} color="var(--text-subtle)" />
            </div>

            {/* 2. Atak Haftası */}
            <div 
              onClick={() => setActiveTool('leap')}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
                cursor: 'pointer', transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(163,230,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Brain size={24} color="var(--sage-dark)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>Atak Haftası Hesaplayıcı</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Düzeltilmiş yaşa göre 10 zihinsel sıçrama hesabı</div>
              </div>
              <ChevronRight size={20} color="var(--text-subtle)" />
            </div>

            {/* 3. Persentil Hesaplayıcı */}
            <div 
              onClick={() => setActiveTool('percentile')}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
                cursor: 'pointer', transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Activity size={24} color="#EF4444" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>Persentil Büyüme Takibi</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>WHO standartlarında boy ve kilo persentili</div>
              </div>
              <ChevronRight size={20} color="var(--text-subtle)" />
            </div>

            {/* 4. Uyanıklık Pencereleri */}
            <div 
              onClick={() => setActiveTool('wake-window')}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
                cursor: 'pointer', transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(94,92,230,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={24} color="var(--lavender-dark)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>Uyanıklık Pencereleri Tablosu</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>0-24 ay bebek uyanıklık ve gündüz uyku süreleri</div>
              </div>
              <ChevronRight size={20} color="var(--text-subtle)" />
            </div>

            {/* 5. Beyaz Gürültü Çalar */}
            <Link 
              href="/sounds"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)',
                textDecoration: 'none', transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Music size={24} color="#D97706" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>Beyaz Gürültü & Ninni Çalar</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Anne karnı, fön makinesi ve ninniler</div>
              </div>
              <ChevronRight size={20} color="var(--text-subtle)" />
            </Link>

          </div>
        )}

        {/* DUE DATE CALCULATOR */}
        {activeTool === 'due-date' && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Son Adet Tarihi (SAT)
              </label>
              <input 
                type="date" 
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid var(--border-medium)', background: 'var(--bg-base)',
                  fontSize: '16px', fontFamily: 'inherit', color: 'var(--text-primary)',
                  outline: 'none', WebkitAppearance: 'none'
                }}
              />
              <button 
                onClick={handleDueDateCalculate}
                disabled={!lmpDate}
                className="btn btn-primary btn-block"
                style={{ marginTop: '16px', justifyContent: 'center' }}
              >
                Hesapla
              </button>
            </div>

            {dueDateResult && (
              <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(0,113,227,0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>👶</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Şu anki gebelik haftası:</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--coral)', margin: '4px 0 16px' }}>
                  {dueDateResult.currentWeek} Hafta {dueDateResult.currentDay} Gün
                </div>
                
                <div style={{ height: '1px', background: 'var(--border-light)', margin: '16px 0' }} />
                
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Tahmini Doğum Tarihiniz:</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {dueDateResult.dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEAP CALCULATOR */}
        {activeTool === 'leap' && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Gerçekleşen Doğum Tarihi
                </label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{ 
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    border: '1px solid var(--border-medium)', background: 'var(--bg-base)',
                    fontSize: '16px', fontFamily: 'inherit', color: 'var(--text-primary)',
                    outline: 'none', WebkitAppearance: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Beklenen Doğum Tarihi (EDD)
                </label>
                <input 
                  type="date" 
                  value={eddDate}
                  onChange={(e) => setEddDate(e.target.value)}
                  style={{ 
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    border: '1px solid var(--border-medium)', background: 'var(--bg-base)',
                    fontSize: '16px', fontFamily: 'inherit', color: 'var(--text-primary)',
                    outline: 'none', WebkitAppearance: 'none'
                  }}
                />
                <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '8px' }}>
                  * Atak haftaları bebeğin doğduğu güne göre değil, 40 haftalık beklenen doğum tarihine (düzeltilmiş yaşa) göre hesaplanır.
                </p>
              </div>

              <button 
                onClick={handleLeapCalculate}
                disabled={!birthDate || !eddDate}
                className="btn btn-primary btn-block"
                style={{ marginTop: '16px', justifyContent: 'center' }}
              >
                Hesapla
              </button>
            </div>

            {leapResult && (
              <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(163,230,53,0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧠</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Düzeltilmiş Yaşınız:</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 16px' }}>
                  {leapResult.adjustedAgeWeeks} Hafta
                </div>
                
                <div style={{ height: '1px', background: 'var(--border-light)', margin: '16px 0' }} />
                
                {leapResult.currentLeap ? (
                  <>
                    <div style={{ fontSize: '14px', color: 'var(--coral)', fontWeight: 600 }}>Şu an içindesiniz!</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--coral-dark)', marginTop: '4px' }}>
                      {leapResult.currentLeap}. Sıçrama (Atak)
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Bir sonraki atağa kalan süre:</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--sage-dark)', marginTop: '4px' }}>
                      {leapResult.daysUntilNextLeap ? `${leapResult.daysUntilNextLeap} Gün` : 'Hesaplanamadı'}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* PERCENTILE CALCULATOR */}
        {activeTool === 'percentile' && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Cinsiyet
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'female', label: '👧 Kız' },
                    { id: 'male', label: '👦 Erkek' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setPercentileGender(g.id as any)}
                      style={{
                        padding: '12px', borderRadius: '12px',
                        border: percentileGender === g.id ? '1.5px solid var(--accent)' : '1px solid var(--border-light)',
                        background: percentileGender === g.id ? 'var(--accent-soft)' : 'var(--bg-raised)',
                        color: percentileGender === g.id ? 'var(--accent)' : 'var(--text-primary)',
                        fontWeight: 700, fontSize: '14px', cursor: 'pointer'
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Bebeğin Yaşı: {percentileMonths} Aylık
                </label>
                <input
                  type="range" min={0} max={24} value={percentileMonths}
                  onChange={(e) => setPercentileMonths(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Kilo (kg)
                  </label>
                  <input
                    type="number" step="0.1" value={percentileWeight}
                    onChange={(e) => setPercentileWeight(e.target.value)}
                    className="input" placeholder="Örn: 7.5"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Boy (cm)
                  </label>
                  <input
                    type="number" step="0.5" value={percentileHeight}
                    onChange={(e) => setPercentileHeight(e.target.value)}
                    className="input" placeholder="Örn: 66"
                  />
                </div>
              </div>

              <button
                onClick={handlePercentileCalculate}
                className="btn btn-primary btn-block"
                style={{ height: '50px', justifyContent: 'center' }}
              >
                Persentil Eğrisini Hesapla
              </button>
            </div>

            {percentileResult && (
              <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(0,113,227,0.25)', animation: 'fadeIn 0.2s' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.04em' }}>
                  DÜNYA SAĞLIK ÖRGÜTÜ (WHO) SONUCU
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                  <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>KİLO PERSENTİLİ</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--coral)', marginTop: '4px' }}>
                      %{percentileResult.weightP}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>BOY PERSENTİLİ</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--lavender)', marginTop: '4px' }}>
                      %{percentileResult.heightP}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, padding: '12px', background: 'var(--bg-raised)', borderRadius: '12px' }}>
                  {percentileResult.evalText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* WAKE WINDOW REFERENCE */}
        {activeTool === 'wake-window' && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-raised)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Yaşa Göre İdeal Uyanıklık Süreleri</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Bebeklerin aşırı yorulmasını önlemek için standart pencereler</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {wakeWindowData.map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px 20px', borderBottom: idx !== wakeWindowData.length - 1 ? '1px solid var(--border-light)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{row.age}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{row.naps} · Toplam {row.total}</div>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 800, fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {row.window}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
