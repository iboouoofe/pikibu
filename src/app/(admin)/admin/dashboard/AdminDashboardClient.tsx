'use client'

import { TrendingUp, TrendingDown, Users, Baby, Crown, DollarSign, Activity, Bell, BarChart2, Eye } from 'lucide-react'

const kpis = [
  {
    label: 'Toplam Kullanıcı',
    value: '52.841',
    change: '+12.4%',
    up: true,
    icon: Users,
    color: '#0071E3',
    bg: 'rgba(0,113,227,0.10)',
    detail: 'Geçen aya göre +5.724',
  },
  {
    label: 'Premium Aboneler',
    value: '8.432',
    change: '+8.1%',
    up: true,
    icon: Crown,
    color: '#A5A6F6',
    bg: 'rgba(165,166,246,0.10)',
    detail: '%15.9 dönüşüm oranı',
  },
  {
    label: 'Aylık Gelir (MRR)',
    value: '₺1.256.800',
    change: '+11.3%',
    up: true,
    icon: DollarSign,
    color: '#8EBA9A',
    bg: 'rgba(142,186,154,0.10)',
    detail: 'ARR: ₺15.081.600',
  },
  {
    label: 'Günlük Aktif (DAU)',
    value: '24.310',
    change: '-2.1%',
    up: false,
    icon: Activity,
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.10)',
    detail: 'MAU: 41.280 · Oran: %58.9',
  },
  {
    label: 'Kayıtlı Bebek',
    value: '49.204',
    change: '+14.1%',
    up: true,
    icon: Baby,
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.10)',
    detail: '3.820 prematüre profili',
  },
  {
    label: 'Churn Oranı',
    value: '%3.2',
    change: '-0.4pp',
    up: true,
    icon: TrendingDown,
    color: '#4ADE80',
    bg: 'rgba(74,222,128,0.10)',
    detail: 'Endüstri ort: %5.1',
  },
]

const recentUsers = [
  { name: 'Ayşe Kaya', email: 'ayse@gmail.com', baby: 'Ece (3 ay)', plan: 'Premium', joined: '2 saat önce', avatar: 'AK' },
  { name: 'Fatma Demir', email: 'fatma@gmail.com', baby: 'Ahmet (7 ay)', plan: 'Basic', joined: '4 saat önce', avatar: 'FD' },
  { name: 'Zeynep Arslan', email: 'zeynep@icloud.com', baby: 'Leyla (1 ay)', plan: 'Premium', joined: '6 saat önce', avatar: 'ZA' },
  { name: 'Merve Çelik', email: 'merve@gmail.com', baby: 'Yusuf (5 ay)', plan: 'Basic', joined: '1 gün önce', avatar: 'MÇ' },
  { name: 'Seda Yıldız', email: 'seda@outlook.com', baby: 'Zehra (9 ay)', plan: 'Premium', joined: '1 gün önce', avatar: 'SY' },
]

// Simplified bar chart data
const chartData = [
  { label: 'Eyl', users: 380, premium: 52 },
  { label: 'Eki', users: 420, premium: 61 },
  { label: 'Kas', users: 390, premium: 58 },
  { label: 'Ara', users: 450, premium: 71 },
  { label: 'Oca', users: 480, premium: 79 },
  { label: 'Şub', users: 510, premium: 85 },
  { label: 'Mar', users: 540, premium: 92 },
]

const maxUsers = Math.max(...chartData.map(d => d.users))

export default function AdminDashboardClient() {
  return (
    <div style={{ padding: '32px', background: 'var(--bg-base)', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })} — Gerçek zamanlı sistem verileri
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => {
              const data = { exportedAt: new Date().toISOString(), status: 'Pikibu Production OK' }
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = `pikibu_admin_rapor_${new Date().toISOString().split('T')[0]}.json`
              a.click()
            }}
            className="btn btn-secondary" style={{ gap: '8px' }}
          >
            <BarChart2 size={16} /> Rapor İndir
          </button>
          <a href="/admin/notifications" className="btn btn-primary" style={{ gap: '8px', textDecoration: 'none' }}>
            <Bell size={16} /> Bildirim Gönder
          </a>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {kpis.map(({ label, value, change, up, icon: Icon, color, bg, detail }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={color} />
              </div>
              <div className={`stat-change ${up ? 'up' : 'down'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {change}
              </div>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '6px' }}>{detail}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* User growth chart */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3>Kullanıcı Büyümesi</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Son 7 ay</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--coral)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Toplam</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--lavender)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Premium</span>
              </div>
            </div>
          </div>

          {/* Simple bar chart */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px' }}>
            {chartData.map((d) => (
              <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'flex-end', height: '100%', position: 'relative' }}>
                  <div style={{
                    width: '100%', height: `${(d.users / maxUsers) * 100}%`,
                    background: 'rgba(0,113,227,0.20)',
                    borderRadius: '4px 4px 0 0',
                    position: 'absolute', bottom: 0,
                  }} />
                  <div style={{
                    width: '100%', height: `${(d.premium / maxUsers) * 100}%`,
                    background: 'var(--lavender)',
                    borderRadius: '4px 4px 0 0',
                    position: 'absolute', bottom: 0,
                  }} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion funnel */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '24px' }}>
          <h3 style={{ marginBottom: '6px' }}>Dönüşüm Hunisi</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Basic → Premium</p>

          {[
            { stage: 'Kayıt', count: 52841, pct: 100, color: 'var(--border-light)' },
            { stage: 'Aktif (7 gün)', count: 38420, pct: 72.7, color: 'var(--sage-light)' },
            { stage: 'Deneme', count: 12830, pct: 24.3, color: 'var(--coral-light)' },
            { stage: 'Premium', count: 8432, pct: 15.9, color: 'var(--coral)' },
          ].map(({ stage, count, pct, color }) => (
            <div key={stage} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{stage}</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{count.toLocaleString('tr-TR')}</span>
              </div>
              <div className="progress-bar">
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: color, borderRadius: 'var(--radius-full)',
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '3px' }}>{pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Son Kayıtlar</h3>
          <button className="btn btn-secondary" style={{ gap: '6px', padding: '8px 16px', fontSize: '13px' }}>
            <Eye size={14} /> Tümünü Gör
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-raised)' }}>
              {['Kullanıcı', 'Bebek', 'Plan', 'Katılım'].map(col => (
                <th key={col} style={{
                  padding: '12px 20px', textAlign: 'left', fontSize: '12px',
                  fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user, i) => (
              <tr key={user.email} style={{ borderTop: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: `hsl(${i * 60}, 70%, 80%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {user.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {user.baby}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className={`badge ${user.plan === 'Premium' ? 'badge-premium' : 'badge-sage'}`}>
                    {user.plan === 'Premium' && '⭐ '}{user.plan}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  {user.joined}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
