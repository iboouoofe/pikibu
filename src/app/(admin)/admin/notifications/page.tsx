'use client'

import { useState } from 'react'
import { Send, Users, Bell, Calendar, Tag, ChevronDown, Check } from 'lucide-react'

const segments = [
  { id: 'all', label: 'Tüm Kullanıcılar', count: '52.841', icon: '👥' },
  { id: 'premium', label: 'Premium Aboneler', count: '8.432', icon: '⭐' },
  { id: '0-3months', label: '0–3 Aylık Bebekler', count: '14.230', icon: '🍼' },
  { id: '4-6months', label: '4–6 Aylık Bebekler', count: '18.720', icon: '🥕' },
  { id: '6months+', label: '6+ Aylık (Ek Gıda)', count: '12.840', icon: '🥦' },
  { id: 'leap5', label: '5. Atak Dönemindekiler', count: '3.240', icon: '🧠' },
  { id: 'inactive', label: '7+ Gündür Pasif', count: '8.310', icon: '💤' },
]

const pastNotifications = [
  { id: '1', title: '5. Atak Rehberi Yayında! 🧠', body: '5. atak dönemindeyseniz özel rehberimizi inceleyin.', segment: '5. Atak', sent: '2 gün önce', reach: 3240, opens: 1842 },
  { id: '2', title: 'BLW Başlangıç Paketi 🥦', body: '6. aya giren bebekler için 50+ tarif eklendi!', segment: '6+ Ay', sent: '5 gün önce', reach: 12840, opens: 6921 },
  { id: '3', title: '4. Ay Aşısı Hatırlatıcı 💉', body: 'Bebeğinizin 4. ay aşısı yaklaşıyor. Randevu aldınız mı?', segment: '4–6 Ay', sent: '1 hafta önce', reach: 18720, opens: 9830 },
]

export default function NotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [scheduleLater, setScheduleLater] = useState(false)
  const [notificationsList, setNotificationsList] = useState(pastNotifications)

  const selectedSeg = segments.find(s => s.id === selectedSegment) || segments[0]

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          targetSegment: selectedSegment
        })
      })

      const newNotif = {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        segment: selectedSeg.label,
        sent: 'Az önce',
        reach: parseInt(selectedSeg.count.replace('.', '')) || 5000,
        opens: 0
      }

      setNotificationsList(prev => [newNotif, ...prev])
      setTitle('')
      setBody('')
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ padding: '32px', background: 'var(--bg-base)', minHeight: '100dvh' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ marginBottom: '4px' }}>Push Bildirim Yöneticisi</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Segment bazlı anlık ve zamanlanmış bildirimler gönder
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* Compose form */}
        <div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '28px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--coral)" /> Bildirim Oluştur
            </h3>

            {/* Segment picker */}
            <div className="form-group">
              <label className="label">HEDEF KİTLE</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {segments.map(seg => (
                  <button key={seg.id}
                    onClick={() => setSelectedSegment(seg.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${selectedSegment === seg.id ? 'var(--coral)' : 'var(--border-light)'}`,
                      background: selectedSegment === seg.id ? 'rgba(0,113,227,0.06)' : 'var(--bg-raised)',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      transition: 'all var(--transition-fast)',
                    }}>
                    <span style={{ fontSize: '20px' }}>{seg.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{seg.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{seg.count} kullanıcı</div>
                    </div>
                    {selectedSegment === seg.id && <Check size={18} color="var(--coral)" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="notif-title">BİLDİRİM BAŞLIĞI</label>
              <input id="notif-title" type="text" className="input"
                placeholder="Dikkat çekici bir başlık... (max 65 karakter)"
                value={title} onChange={(e) => setTitle(e.target.value.slice(0, 65))} />
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textAlign: 'right', marginTop: '4px' }}>
                {title.length}/65
              </div>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="notif-body">BİLDİRİM METNİ</label>
              <textarea id="notif-body"
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg-surface)', border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '15px',
                  color: 'var(--text-primary)', outline: 'none', resize: 'vertical',
                  minHeight: '90px',
                }}
                placeholder="Kısa ve değer vaat eden bir mesaj... (max 200 karakter)"
                value={body} onChange={(e) => setBody(e.target.value.slice(0, 200))}
              />
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textAlign: 'right', marginTop: '4px' }}>
                {body.length}/200
              </div>
            </div>

            {/* Schedule toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', cursor: 'pointer' }}>
              <div style={{
                width: '44px', height: '26px',
                background: scheduleLater ? 'var(--coral)' : 'var(--border-medium)',
                borderRadius: '13px', position: 'relative', transition: 'background var(--transition-base)',
                flexShrink: 0,
              }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                  position: 'absolute', top: '3px', left: scheduleLater ? '21px' : '3px',
                  transition: 'left var(--transition-base)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
                <input type="checkbox" style={{ display: 'none' }}
                  checked={scheduleLater} onChange={(e) => setScheduleLater(e.target.checked)} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Zamanlanmış Gönderim</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Belirli bir tarih/saat seç</div>
              </div>
            </label>

            {scheduleLater && (
              <div className="form-group animate-slide-down">
                <label className="label" htmlFor="schedule-time">GÖNDERIM ZAMANI</label>
                <input id="schedule-time" type="datetime-local" className="input" />
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={!title || !body || sending}
              className="btn btn-primary btn-block"
              style={{ height: '52px', fontSize: '15px' }}
            >
              {sent ? (
                <><Check size={18} /> Gönderildi!</>
              ) : sending ? (
                <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
              ) : (
                <><Send size={18} /> {scheduleLater ? 'Zamanla' : 'Şimdi Gönder'} — {selectedSeg.count}</>
              )}
            </button>
          </div>

          {/* Preview */}
          {(title || body) && (
            <div style={{ background: '#1E1E2E', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>
                📱 Önizleme (iPhone kilit ekranı)
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '14px',
                padding: '14px', display: 'flex', gap: '12px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bell size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'white', marginBottom: '3px' }}>
                    {title || 'Bildirim başlığı...'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
                    {body || 'Bildirim metni...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Past notifications */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Geçmiş Bildirimler</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notificationsList.map(notif => (
              <div key={notif.id} style={{
                background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)', padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-coral">{notif.segment}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{notif.sent}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{notif.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>{notif.body}</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{notif.reach.toLocaleString('tr-TR')}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Erişim</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--sage-dark)' }}>{notif.opens.toLocaleString('tr-TR')}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Açılma</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--coral)' }}>
                      %{Math.round((notif.opens / notif.reach) * 100)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Açılma oranı</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
